# 🐳 TUTORIEL INSTALLATION DOCKER - UBUNTU
## Police Main Courante Gabon - Installation Complète avec Docker

---

## 🎯 OBJECTIF

Ce tutoriel vous guide pas à pas pour installer et déployer le système de gestion de main courante des forces de l'ordre du Gabon en utilisant **Docker** sur **Ubuntu**.

**Avantages Docker** :
- ✅ Installation ultra-rapide (5-10 minutes)
- ✅ Isolation complète des services
- ✅ Pas de conflits de dépendances
- ✅ Déploiement identique dev/prod
- ✅ Backup/restauration simplifiés
- ✅ Montée en charge automatique

---

## 📋 PRÉREQUIS

### Système requis
- **Ubuntu 20.04+ LTS** (recommandé 22.04)
- **4 GB RAM minimum** (8 GB recommandé)
- **20 GB espace disque** minimum
- **Connexion Internet** stable
- **Accès root/sudo**

### Vérification système
```bash
# Vérifier version Ubuntu
lsb_release -a

# Vérifier ressources
free -h
df -h
```

---

## 🚀 ÉTAPE 1 : PRÉPARATION SYSTÈME UBUNTU

### 1.1 Mise à jour complète du système

```bash
# Mise à jour de la liste des paquets
sudo apt update

# Mise à jour de tous les paquets installés
sudo apt upgrade -y

# Nettoyage des paquets obsolètes
sudo apt autoremove -y
sudo apt autoclean
```

### 1.2 Installation des dépendances de base

```bash
# Outils essentiels
sudo apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    nano \
    htop \
    tree

# Vérification installation
curl --version
git --version
```

---

## 🐳 ÉTAPE 2 : INSTALLATION DOCKER

### 2.1 Désinstallation versions anciennes (si présentes)

```bash
# Supprimer anciennes versions Docker
sudo apt remove -y docker docker-engine docker.io containerd runc

# Nettoyer complètement
sudo apt purge -y docker-ce docker-ce-cli containerd.io
sudo rm -rf /var/lib/docker
sudo rm -rf /etc/docker
```

### 2.2 Installation Docker Engine officiel

```bash
# Ajouter clé GPG officielle Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Ajouter repository Docker stable
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Mettre à jour avec nouveau repository
sudo apt update

# Installer Docker Engine + CLI + Containerd
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Vérifier installation
sudo docker --version
sudo docker compose version
```

### 2.3 Configuration post-installation

```bash
# Démarrer et activer Docker au boot
sudo systemctl start docker
sudo systemctl enable docker

# Ajouter utilisateur au groupe docker (évite sudo)
sudo usermod -aG docker $USER

# Appliquer changements groupe (se reconnecter ou utiliser newgrp)
newgrp docker

# Tester Docker sans sudo
docker run hello-world
```

**⚠️ IMPORTANT** : Après l'ajout au groupe docker, **redémarrez votre session** ou utilisez `newgrp docker`.

### 2.4 Configuration Docker optimisée

```bash
# Créer fichier de configuration Docker
sudo mkdir -p /etc/docker

# Configuration optimisée pour production
sudo tee /etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "live-restore": true,
  "userland-proxy": false,
  "experimental": false,
  "metrics-addr": "127.0.0.1:9323",
  "default-address-pools": [
    {
      "base": "172.30.0.0/16",
      "size": 24
    }
  ]
}
EOF

# Redémarrer Docker avec nouvelle config
sudo systemctl restart docker

# Vérifier état Docker
sudo systemctl status docker
docker info
```

---

## 📦 ÉTAPE 3 : TÉLÉCHARGEMENT DU PROJET

### 3.1 Clonage du repository

```bash
# Créer dossier de travail
mkdir -p ~/police-gabon
cd ~/police-gabon

# Cloner le projet
git clone https://github.com/votre-repo/police-main-courante-gabon.git .

# Vérifier structure
tree -L 2
```

### 3.2 Structure attendue

```
police-main-courante-gabon/
├── backend/                 # API Node.js
├── frontend/               # Interface Angular  
├── database/               # Scripts SQL
├── docker/                 # Configurations Docker
├── docker-compose.yml      # Orchestration
├── docker-compose.prod.yml # Production
├── .env.example           # Variables exemple
└── README.md             # Documentation
```

---

## 🐳 ÉTAPE 4 : CONFIGURATION DOCKER

### 4.1 Création des fichiers Docker

#### Backend Dockerfile

```bash
# Créer Dockerfile backend
cat > backend/Dockerfile <<EOF
FROM node:18-alpine

WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer dépendances
RUN npm ci --only=production

# Copier code source
COPY . .

# Créer utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

# Changer propriétaire
RUN chown -R nodeuser:nodejs /app
USER nodeuser

# Exposer port
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Démarrer application
CMD ["node", "server.js"]
EOF
```

#### Frontend Dockerfile

```bash
# Créer Dockerfile frontend
cat > frontend/Dockerfile <<EOF
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copier package.json
COPY package*.json ./

# Installer dépendances
RUN npm ci

# Copier code source
COPY . .

# Build production
RUN npm run build:prod

# Stage 2: Nginx
FROM nginx:alpine

# Copier build Angular
COPY --from=builder /app/dist/police-main-courante /usr/share/nginx/html

# Configuration Nginx optimisée
COPY nginx.conf /etc/nginx/nginx.conf

# Exposer port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost || exit 1

CMD ["nginx", "-g", "daemon off;"]
EOF
```

#### Configuration Nginx

```bash
# Créer configuration Nginx optimisée
cat > frontend/nginx.conf <<EOF
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                    '\$status \$body_bytes_sent "\$http_referer" '
                    '"\$http_user_agent" "\$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/x-javascript
        application/xml+rss
        application/javascript
        application/json;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Angular routes
        location / {
            try_files \$uri \$uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # API proxy
        location /api/ {
            proxy_pass http://backend:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
        }

        # Socket.IO
        location /socket.io/ {
            proxy_pass http://backend:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }
    }
}
EOF
```

### 4.2 Docker Compose principal

```bash
# Créer docker-compose.yml
cat > docker-compose.yml <<EOF
version: '3.8'

services:
  # Base de données MySQL
  database:
    image: mysql:8.0
    container_name: police-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: \${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: \${DB_NAME}
      MYSQL_USER: \${DB_USER}
      MYSQL_PASSWORD: \${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    ports:
      - "3306:3306"
    networks:
      - police-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

  # Backend API
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    container_name: police-backend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DB_HOST=database
      - DB_PORT=3306
      - DB_NAME=\${DB_NAME}
      - DB_USER=\${DB_USER}
      - DB_PASSWORD=\${DB_PASSWORD}
      - JWT_SECRET=\${JWT_SECRET}
      - PORT=3000
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/logs:/app/logs
    ports:
      - "3000:3000"
    depends_on:
      database:
        condition: service_healthy
    networks:
      - police-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend Angular
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: police-frontend
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    networks:
      - police-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis pour cache et sessions
  redis:
    image: redis:7-alpine
    container_name: police-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - police-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  mysql_data:
    driver: local
  redis_data:
    driver: local

networks:
  police-network:
    driver: bridge
EOF
```

### 4.3 Variables d'environnement

```bash
# Créer fichier .env
cat > .env <<EOF
# Base de données
DB_HOST=database
DB_PORT=3306
DB_NAME=police_main_courante
DB_USER=police_user
DB_PASSWORD=MotDePasseTresSecurise2024!
DB_ROOT_PASSWORD=RootPasswordSuperSecurise2024!

# JWT et sécurité
JWT_SECRET=CleJWTSuperSecuriseProduction2024VraimentLongue
SESSION_SECRET=CleSessionSuperSecuriseProduction2024

# Configuration serveur
NODE_ENV=production
PORT=3000
FRONTEND_URL=http://localhost

# Email (optionnel)
EMAIL_HOST=smtp.votre-domaine.com
EMAIL_USER=noreply@police.ga
EMAIL_PASSWORD=MotDePasseEmail

# Admin par défaut
ADMIN_EMAIL=admin@police.ga
ADMIN_PASSWORD=AdminSecurise2024!

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Uploads
UPLOAD_MAX_SIZE=10485760
UPLOAD_PATH=/app/uploads
EOF

# Sécuriser le fichier .env
chmod 600 .env
```

---

## 🚀 ÉTAPE 5 : DÉPLOIEMENT

### 5.1 Préparation base de données

```bash
# Créer script d'initialisation
mkdir -p database

cat > database/init.sql <<EOF
-- Script d'initialisation Police Main Courante Gabon
CREATE DATABASE IF NOT EXISTS police_main_courante CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE police_main_courante;

-- Création utilisateur avec permissions limitées
CREATE USER IF NOT EXISTS 'police_user'@'%' IDENTIFIED BY 'MotDePasseTresSecurise2024!';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX ON police_main_courante.* TO 'police_user'@'%';
FLUSH PRIVILEGES;

-- Table de vérification
CREATE TABLE IF NOT EXISTS installation_check (
    id INT AUTO_INCREMENT PRIMARY KEY,
    version VARCHAR(20) NOT NULL,
    installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO installation_check (version) VALUES ('2.0.0');

SELECT 'Base de données initialisée avec succès!' as message;
EOF
```

### 5.2 Build et démarrage

```bash
# Nettoyer tout état Docker précédent
docker system prune -a -f

# Build des images (première fois plus long)
docker compose build --no-cache

# Démarrer tous les services
docker compose up -d

# Vérifier statut des conteneurs
docker compose ps

# Voir les logs en temps réel
docker compose logs -f
```

### 5.3 Vérification du déploiement

```bash
# Vérifier santé des services
docker compose ps
docker stats --no-stream

# Tester connectivité base de données
docker compose exec database mysql -u police_user -p -e "SELECT 'DB OK' as status;"

# Tester API backend
curl http://localhost:3000/api/health

# Tester frontend
curl http://localhost
```

**✅ Si tout fonctionne**, vous devriez voir :
- **Frontend** : http://localhost
- **API** : http://localhost:3000/api
- **Base de données** : Accessible sur port 3306

---

## 🔧 ÉTAPE 6 : CONFIGURATION POST-INSTALLATION

### 6.1 Accès à l'application

```bash
# Ouvrir navigateur sur l'application
firefox http://localhost &

# Ou avec curl pour tester
curl -I http://localhost
```

### 6.2 Création utilisateur administrateur

```bash
# Via interface web : http://localhost/auth/register
# Ou via API directe :

curl -X POST http://localhost:3000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Administrateur",
    "prenoms": "Système",
    "email": "admin@police.ga", 
    "password": "AdminSecurise2024!",
    "matricule_police": "ADM000001",
    "role": "admin"
  }'
```

### 6.3 Configuration initiale données

```bash
# Se connecter au conteneur backend pour importer données
docker compose exec backend node scripts/init-data.js

# Ou manuellement via MySQL
docker compose exec database mysql -u police_user -p police_main_courante < database/gabon-data.sql
```

---

## 📊 ÉTAPE 7 : MONITORING ET MAINTENANCE

### 7.1 Surveillance des services

```bash
# État temps réel
docker compose ps
docker stats

# Logs spécifiques
docker compose logs backend
docker compose logs frontend  
docker compose logs database

# Suivre logs en temps réel
docker compose logs -f --tail=100
```

### 7.2 Scripts de maintenance

#### Script backup automatique

```bash
# Créer script de sauvegarde
cat > scripts/backup.sh <<EOF
#!/bin/bash
DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"

mkdir -p \$BACKUP_DIR

echo "🗃️ Sauvegarde base de données..."
docker compose exec -T database mysqldump -u police_user -pMotDePasseTresSecurise2024! police_main_courante > \$BACKUP_DIR/db_\$DATE.sql

echo "📁 Sauvegarde uploads..."
docker compose exec -T backend tar czf - uploads > \$BACKUP_DIR/uploads_\$DATE.tar.gz

echo "✅ Sauvegarde terminée: \$BACKUP_DIR"
EOF

chmod +x scripts/backup.sh

# Tester sauvegarde
./scripts/backup.sh
```

#### Script de mise à jour

```bash
# Créer script mise à jour
cat > scripts/update.sh <<EOF
#!/bin/bash

echo "🔄 Mise à jour Police Main Courante..."

# Sauvegarder avant mise à jour
./scripts/backup.sh

# Arrêter services
docker compose down

# Récupérer dernière version
git pull origin main

# Rebuild et redémarrer
docker compose build --no-cache
docker compose up -d

echo "✅ Mise à jour terminée!"
EOF

chmod +x scripts/update.sh
```

### 7.3 Monitoring ressources

```bash
# Surveiller utilisation disque
df -h
docker system df

# Nettoyer ressources Docker non utilisées
docker system prune -f

# Surveiller mémoire
free -h
docker stats --no-stream
```

---

## 🛡️ ÉTAPE 8 : SÉCURISATION

### 8.1 Firewall Ubuntu

```bash
# Activer UFW (Ubuntu Firewall)
sudo ufw --force enable

# Autoriser SSH (si accès distant)
sudo ufw allow ssh

# Autoriser HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Autoriser MySQL (si accès externe nécessaire)
# sudo ufw allow 3306/tcp

# Vérifier règles
sudo ufw status verbose
```

### 8.2 SSL/HTTPS avec Let's Encrypt

```bash
# Installer Certbot
sudo apt install -y certbot

# Obtenir certificat (remplacer votre-domaine.com)
sudo certbot certonly --standalone -d votre-domaine.com -d www.votre-domaine.com

# Ajouter renouvellement automatique
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

# Modifier docker-compose.yml pour HTTPS
# (ajouter volumes pour certificats SSL)
```

### 8.3 Sauvegardes automatiques

```bash
# Ajouter cron sauvegarde quotidienne
(crontab -l 2>/dev/null; echo "0 2 * * * /home/$USER/police-gabon/scripts/backup.sh") | crontab -

# Vérifier crontab
crontab -l
```

---

## 🚨 DÉPANNAGE

### Problèmes courants

#### 1. Erreur "port already in use"
```bash
# Voir qui utilise le port
sudo netstat -tulpn | grep :80
sudo lsof -i :80

# Arrêter service en conflit
sudo systemctl stop apache2
sudo systemctl stop nginx
```

#### 2. Conteneur ne démarre pas
```bash
# Voir logs détaillés
docker compose logs [service_name]

# Inspecter conteneur
docker inspect [container_name]

# Se connecter au conteneur
docker compose exec [service_name] /bin/sh
```

#### 3. Base de données inaccessible
```bash
# Vérifier MySQL
docker compose exec database mysql -u root -p

# Réinitialiser mot de passe
docker compose down
docker volume rm police-gabon_mysql_data
docker compose up -d
```

#### 4. Manque d'espace disque
```bash
# Nettoyer Docker
docker system prune -a -f
docker volume prune -f

# Nettoyer logs
sudo journalctl --vacuum-time=7d
```

### Commandes utiles

```bash
# Redémarrer service spécifique
docker compose restart backend

# Rebuild service spécifique
docker compose build --no-cache backend
docker compose up -d backend

# Voir utilisation ressources
docker stats
docker system df

# Sauvegarder/restaurer volumes
docker run --rm -v police-gabon_mysql_data:/data -v $(pwd):/backup ubuntu tar czf /backup/mysql_backup.tar.gz -C /data .
```

---

## ✅ VALIDATION INSTALLATION

### Checklist finale

- [ ] Docker installé et fonctionnel
- [ ] Tous les conteneurs démarrent (database, backend, frontend, redis)
- [ ] Frontend accessible sur http://localhost
- [ ] API répond sur http://localhost:3000/api/health
- [ ] Base de données accessible
- [ ] Utilisateur admin créé
- [ ] Sauvegardes configurées
- [ ] Firewall configuré
- [ ] Logs disponibles

### Tests fonctionnels

```bash
# Test complet
echo "🧪 Tests fonctionnels..."

# Test frontend
curl -I http://localhost | grep "200 OK" && echo "✅ Frontend OK" || echo "❌ Frontend KO"

# Test API
curl http://localhost:3000/api/health | grep "OK" && echo "✅ API OK" || echo "❌ API KO"

# Test base de données
docker compose exec -T database mysql -u police_user -pMotDePasseTresSecurise2024! -e "SELECT 'DB OK';" && echo "✅ Database OK" || echo "❌ Database KO"

echo "🎉 Installation Docker Ubuntu terminée avec succès!"
```

---

## 📞 SUPPORT

### Logs et diagnostic

```bash
# Tout voir
docker compose logs --tail=100 -f

# Exporter logs pour support
docker compose logs > debug-logs.txt
docker compose ps > debug-status.txt
docker system info > debug-system.txt
```

### Ressources utiles

- **Documentation Docker** : https://docs.docker.com
- **Docker Compose** : https://docs.docker.com/compose/
- **Logs application** : `docker compose logs -f`
- **Support Ubuntu** : https://ubuntu.com/support

---

**🎉 Installation Docker Ubuntu Terminée !**

Votre système de gestion de main courante des forces de l'ordre du Gabon est maintenant opérationnel via Docker sur Ubuntu.

**Accès** :
- **Application** : http://localhost
- **Admin** : admin@police.ga / AdminSecurise2024!

---

*Guide créé pour la Police Nationale Gabonaise 🇬🇦*