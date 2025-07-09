# TUTORIEL D'INSTALLATION COMPLET
## Logiciel de Gestion de Main Courante des Forces de l'Ordre - Gabon

---

## 📋 AMÉLIORATIONS AJOUTÉES

### ✅ Module Effectifs Amélioré
- **Photos agents** : Upload et gestion des photos de profil
- **Double matricule** : Matricule police + matricule solde + ID système
- **Statuts étendus** : Actif, congé, permission, stage, détachement, maladie, disponibilité, décédé
- **Calculs automatiques** : Âge, années de service, retraite possible

### ✅ Nouveau Module Gestion de Carrière
- **Calcul automatique** des années de service depuis la date de prise de service
- **Historique complet** des mouvements (promotions, mutations, affectations)
- **Suivi des formations** et spécialisations
- **Distinctions et sanctions**

### ✅ Nouveau Module Congés
- **Types de congés** : Annuel, maladie, maternité/paternité, formation, exceptionnel, sans solde
- **Calcul automatique** des jours ouvrés
- **Gestion des remplaçants**
- **Workflow de validation**
- **Certificats médicaux**

### ✅ Nouveau Module Retraite
- **Calcul automatique de l'âge** basé sur la date de naissance
- **Retraite par grade** :
  - Agents/Sous-officiers : 50-55 ans
  - Officiers : 55-60 ans
  - Commissaires+ : 61-65 ans
- **Alerte automatique** approche retraite

### ✅ Hiérarchie Territoriale Complète
```
Région → Département → Commune → Commissariat
```
- **9 Provinces du Gabon** avec coordonnées GPS
- **Affectations géographiques** précises
- **Registres par zone**

### ✅ Directions Spécialisées
- Direction de la Voie Publique
- Direction des Enquêtes  
- Direction du Renseignement
- Direction Administrative
- Direction Formation/Logistique/IT/Communication

### ✅ Sous-Module Registres des Agents
**12 types de registres personnalisés** :
1. **Effectifs généraux** par lieu d'affectation
2. **Registre retraites** avec calculs automatiques
3. **Registre congés** par types
4. **Registre permissions/stages/détachements**
5. **Registre décès** avec causes
6. **Registre sanctions** par gravité
7. **Registre distinctions** et décorations
8. **Registre formations** et diplômes
9. **Registre mutations** géographiques
10. **Registre promotions** de grade

### ✅ Module Reconnaissance Moyens Roulants Amélioré
**Photos complètes** :
- Photo face véhicule
- Photo profil véhicule  
- Photo arrière/intérieur
- Photo carte grise
- Photo attestation assurance
- Photo permis de conduire

**Filtres rapides** :
- Recherche par plaque d'immatriculation
- Recherche par carte grise
- Recherche par permis de conduire
- Recherche par nom propriétaire
- Recherche par administration propriétaire

### ✅ Module Rapports Personnalisables
- Templates France adaptés au Gabon
- Génération PDF automatique
- Signatures numériques
- Export multiple formats

---

## 🚀 INSTALLATION

### 📋 PRÉREQUIS

#### Logiciels Requis
```bash
Node.js 18+ LTS
MySQL 8.0+
Git
Nginx (optionnel)
PM2 (pour production)
```

#### Systèmes Supportés
- ✅ Ubuntu 20.04+ / Debian 11+
- ✅ CentOS 8+ / RHEL 8+
- ✅ Windows Server 2019+
- ✅ macOS 10.15+ (développement)

---

## 🖥️ INSTALLATION LOCALHOST (Machine Locale)

### Étape 1: Préparation Environnement

#### Sur Ubuntu/Debian
```bash
# Mise à jour système
sudo apt update && sudo apt upgrade -y

# Installation Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installation MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Installation Git
sudo apt install git -y
```

#### Sur Windows
```powershell
# Installer via Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

# Installer Node.js, MySQL, Git
choco install nodejs mysql git -y
```

#### Sur macOS
```bash
# Installer Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installer dépendances
brew install node mysql git
```

### Étape 2: Clonage et Configuration

```bash
# Cloner le projet
git clone https://github.com/votre-repo/police-main-courante-gabon.git
cd police-main-courante-gabon

# Installer dépendances root
npm install

# Configuration base de données MySQL
mysql -u root -p
```

```sql
-- Création base de données
CREATE DATABASE police_main_courante CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Création utilisateur
CREATE USER 'police_user'@'localhost' IDENTIFIED BY 'SecurePassword123!';
GRANT ALL PRIVILEGES ON police_main_courante.* TO 'police_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Étape 3: Configuration Variables d'Environnement

```bash
# Copier fichier exemple
cp backend/.env.example backend/.env

# Éditer configuration
nano backend/.env
```

```env
# Configuration Base de Données
DB_HOST=localhost
DB_PORT=3306
DB_NAME=police_main_courante
DB_USER=police_user
DB_PASSWORD=SecurePassword123!

# Configuration JWT
JWT_SECRET=VotreCleSuperSecrete123456789
JWT_EXPIRES_IN=24h

# Configuration Serveur
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:4200

# Configuration Email (optionnel pour tests)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=votre.email@gmail.com
EMAIL_PASSWORD=votre_mot_de_passe_app

# Configuration Admin par défaut
ADMIN_EMAIL=admin@police.ga
ADMIN_PASSWORD=Admin@123456
```

### Étape 4: Installation et Démarrage

```bash
# Installation backend
npm run install:backend

# Installation frontend
npm run install:frontend

# Démarrage en mode développement
npm run dev:all
```

### Étape 5: Vérification Installation

```bash
# Vérifier backend (terminal 1)
curl http://localhost:3000/api/auth/status

# Vérifier frontend (navigateur)
# http://localhost:4200
```

**🎉 Installation Localhost Terminée !**

---

## 🖥️ INSTALLATION SERVEUR (Production)

### Étape 1: Préparation Serveur Ubuntu/CentOS

#### Ubuntu Server 20.04+
```bash
# Connexion serveur
ssh root@votre-serveur-ip

# Mise à jour système
apt update && apt upgrade -y

# Création utilisateur police
adduser police
usermod -aG sudo police
su - police

# Installation Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installation MySQL 8.0
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Installation Nginx
sudo apt install nginx -y

# Installation PM2
sudo npm install -g pm2

# Installation certbot pour SSL
sudo apt install certbot python3-certbot-nginx -y
```

#### CentOS 8+
```bash
# Mise à jour système
sudo dnf update -y

# Installation Node.js
sudo dnf module install nodejs:18 -y

# Installation MySQL
sudo dnf install mysql-server -y
sudo systemctl start mysqld
sudo systemctl enable mysqld
sudo mysql_secure_installation

# Installation Nginx
sudo dnf install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Installation PM2
sudo npm install -g pm2
```

### Étape 2: Configuration Base de Données

```bash
# Configuration MySQL
sudo mysql -u root -p
```

```sql
-- Base de données production
CREATE DATABASE police_main_courante CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Utilisateur sécurisé
CREATE USER 'police_user'@'localhost' IDENTIFIED BY 'MotDePasseTresSecurise2024!';
GRANT ALL PRIVILEGES ON police_main_courante.* TO 'police_user'@'localhost';

-- Configuration sécurité
SET GLOBAL sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';
FLUSH PRIVILEGES;
EXIT;
```

### Étape 3: Déploiement Application

```bash
# Création dossier application
sudo mkdir -p /var/www/police-main-courante
sudo chown police:police /var/www/police-main-courante
cd /var/www/police-main-courante

# Clonage code
git clone https://github.com/votre-repo/police-main-courante-gabon.git .

# Configuration production
cp backend/.env.example backend/.env
nano backend/.env
```

```env
# Configuration Production
DB_HOST=localhost
DB_NAME=police_main_courante
DB_USER=police_user
DB_PASSWORD=MotDePasseTresSecurise2024!

NODE_ENV=production
PORT=3000
FRONTEND_URL=https://votre-domaine.com

# Clés sécurisées (générer nouvelles)
JWT_SECRET=CleJWTSuperSecuriseProduction2024
SESSION_SECRET=CleSessionSuperSecuriseProduction2024

# Email production
EMAIL_HOST=smtp.votre-domaine.com
EMAIL_USER=noreply@votre-domaine.com
EMAIL_PASSWORD=MotDePasseEmail

# Admin production
ADMIN_EMAIL=admin@police.ga
ADMIN_PASSWORD=MotDePasseAdminSecurise2024!
```

### Étape 4: Installation Dépendances

```bash
# Installation backend
cd backend && npm ci --only=production

# Installation frontend
cd ../frontend && npm ci

# Build frontend production
npm run build:prod
```

### Étape 5: Configuration PM2

```bash
# Création fichier PM2
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'police-backend',
    script: './backend/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/police-backend-error.log',
    out_file: '/var/log/pm2/police-backend-out.log',
    log_file: '/var/log/pm2/police-backend.log',
    time: true
  }]
};
```

```bash
# Démarrage avec PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Étape 6: Configuration Nginx

```bash
# Configuration Nginx
sudo nano /etc/nginx/sites-available/police-main-courante
```

```nginx
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;
    
    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;
    
    # Certificats SSL (à configurer avec Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;
    
    # Configuration SSL sécurisée
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Headers sécurité
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    
    # Frontend (Angular)
    location / {
        root /var/www/police-main-courante/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API Backend
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Socket.IO
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Uploads
    location /uploads/ {
        root /var/www/police-main-courante/backend;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Sécurité fichiers
    location ~ /\. {
        deny all;
    }
}
```

```bash
# Activation configuration
sudo ln -s /etc/nginx/sites-available/police-main-courante /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Étape 7: Configuration SSL avec Let's Encrypt

```bash
# Obtention certificat SSL
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Renouvellement automatique
sudo crontab -e
```

```cron
# Renouvellement SSL automatique
0 12 * * * /usr/bin/certbot renew --quiet
```

### Étape 8: Sauvegardes Automatiques

```bash
# Script sauvegarde
sudo nano /usr/local/bin/backup-police.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/police-main-courante"
APP_DIR="/var/www/police-main-courante"

# Création dossier backup
mkdir -p $BACKUP_DIR

# Sauvegarde base de données
mysqldump -u police_user -pMotDePasseTresSecurise2024! police_main_courante > $BACKUP_DIR/db_$DATE.sql

# Sauvegarde uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz $APP_DIR/backend/uploads

# Nettoyage anciens backups (garde 30 jours)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup terminé: $DATE"
```

```bash
# Permissions et automatisation
sudo chmod +x /usr/local/bin/backup-police.sh

# Cron sauvegarde quotidienne
sudo crontab -e
```

```cron
# Sauvegarde quotidienne à 2h du matin
0 2 * * * /usr/local/bin/backup-police.sh
```

**🎉 Installation Serveur Terminée !**

---

## ☁️ INSTALLATION CLOUD (AWS/Azure/GCP)

### Option 1: AWS EC2 + RDS

#### Étape 1: Création Infrastructure AWS

```bash
# Via AWS CLI
aws ec2 run-instances \
    --image-id ami-0c55b159cbfafe1d0 \
    --instance-type t3.medium \
    --key-name votre-cle \
    --security-group-ids sg-xxxxxxxx \
    --subnet-id subnet-xxxxxxxx

# Création RDS MySQL
aws rds create-db-instance \
    --db-instance-identifier police-db \
    --db-instance-class db.t3.micro \
    --engine mysql \
    --master-username admin \
    --master-user-password VotreMotDePasse \
    --allocated-storage 20
```

#### Étape 2: Configuration EC2

```bash
# Connexion EC2
ssh -i votre-cle.pem ubuntu@ec2-xx-xx-xx-xx.compute-1.amazonaws.com

# Installation identique à serveur Ubuntu ci-dessus
# Avec configuration RDS pour base de données
```

### Option 2: Digital Ocean App Platform

```yaml
# .do/app.yaml
name: police-main-courante

services:
- name: backend
  source_dir: backend
  github:
    repo: votre-user/police-main-courante-gabon
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  env:
  - key: NODE_ENV
    value: production
  - key: DATABASE_URL
    value: ${db.DATABASE_URL}

- name: frontend
  source_dir: frontend
  github:
    repo: votre-user/police-main-courante-gabon
    branch: main
  build_command: npm run build:prod
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs

databases:
- name: db
  engine: MYSQL
  version: 8.0
```

### Option 3: Docker + Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile.prod
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=database
    depends_on:
      - database
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    restart: unless-stopped

  database:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: police_main_courante
      MYSQL_USER: police_user
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped

volumes:
  mysql_data:
```

```bash
# Déploiement Docker
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🔧 CONFIGURATION POST-INSTALLATION

### 1. Création Utilisateur Administrateur

```bash
# Via interface web http://votre-domaine.com
# Ou via API
curl -X POST http://localhost:3000/api/auth/setup \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Administrateur",
    "prenoms": "Système",
    "email": "admin@police.ga",
    "password": "MotDePasseSecurise2024!",
    "role": "admin"
  }'
```

### 2. Configuration Initiale

1. **Se connecter** avec admin@police.ga
2. **Paramètres Système** → Configuration générale
3. **Créer les structures** : Régions → Départements → Communes
4. **Ajouter les postes** de police du Gabon
5. **Configurer les grades** hiérarchiques
6. **Créer les directions** spécialisées
7. **Importer les agents** existants

### 3. Tests de Fonctionnement

```bash
# Test API
curl http://votre-domaine.com/api/auth/status

# Test Socket.IO
curl http://votre-domaine.com/socket.io/

# Test uploads
curl -F "file=@test.jpg" http://votre-domaine.com/api/uploads/test
```

---

## 📞 SUPPORT ET MAINTENANCE

### Logs et Monitoring

```bash
# Logs application
pm2 logs police-backend

# Logs Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Logs système
journalctl -u mysql
journalctl -u nginx
```

### Maintenance Régulière

```bash
# Mise à jour dépendances
npm audit fix

# Nettoyage logs
pm2 flush

# Optimisation base de données
mysql -u root -p -e "OPTIMIZE TABLE police_main_courante.*"
```

### Résolution Problèmes Courants

1. **Port 3000 occupé** : `sudo lsof -i :3000`
2. **MySQL ne démarre pas** : `sudo systemctl status mysql`
3. **Nginx erreur** : `sudo nginx -t`
4. **PM2 ne démarre pas** : `pm2 delete all && pm2 start ecosystem.config.js`

---

**🎉 Installation Complète Terminée !**

Votre système de gestion de la main courante des forces de l'ordre du Gabon est maintenant opérationnel avec toutes les fonctionnalités avancées.

---

*Documentation créée par l'équipe technique - Version 2.0*