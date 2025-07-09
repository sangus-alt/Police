# 🚔 POLICE MAIN COURANTE GABON 🇬🇦

> **Système de gestion de main courante des forces de l'ordre du Gabon**
> 
> Version 2.0 - Interface Mobile/Tablette + Desktop

---

## 📋 DESCRIPTION

Système complet de gestion de main courante développé spécifiquement pour les forces de l'ordre du Gabon. Cette application permet la gestion numérique de tous les aspects opérationnels d'un commissariat moderne.

### ✨ Nouvelles fonctionnalités V2.0

- 📱 **Interface responsive mobile/tablette**
- 👥 **Module personnel avancé** avec photos et double matriculation
- 🏢 **Gestion carrière complète** avec calcul automatique ancienneté
- 🏖️ **Module congés** avec validation hiérarchique
- 👴 **Module retraite** avec calcul automatique selon grade
- 📊 **12 types de registres** d'agents personnalisables
- 🚗 **Reconnaissance véhicules** avec photos intégrées
- 🗺️ **Cartographie Gabon** avec coordonnées GPS réelles
- 🔐 **Sécurité renforcée** et authentification multi-niveaux

---

## 🌍 MODULES PRINCIPAUX

### 👥 Gestion du Personnel
- ✅ Photos des agents
- ✅ Double matriculation (police + paie) + ID système
- ✅ Statuts étendus (service, congé, permission, formation, détachement, maladie, décédé)
- ✅ Hiérarchie territoriale complète (Région → Département → Commune → Commissariat)
- ✅ Directions spécialisées (circulation, investigations, renseignements, administratif)

### 🏢 Gestion de Carrière
- ✅ Calcul automatique années de service
- ✅ Historique des affectations
- ✅ Évolution des grades
- ✅ Dossier personnel complet

### 🏖️ Module Congés
- ✅ Demandes en ligne
- ✅ Validation hiérarchique
- ✅ Calendrier de planification
- ✅ Soldes automatiques

### 👴 Module Retraite
- ✅ Calcul automatique âge de retraite par grade
- ✅ Suivi des droits acquis
- ✅ Préparation dossiers

### 📊 Registres d'Agents (12 types)
- ✅ Départs en retraite
- ✅ Congés
- ✅ Permissions
- ✅ Formations
- ✅ Détachements
- ✅ Décès
- ✅ Et 6 autres types personnalisables

### 🕒 Planification des Gardes
- ✅ Planning automatique
- ✅ Roulements par équipe
- ✅ Gestion des remplacements

### 💬 Communication Interne
- ✅ Messagerie sécurisée
- ✅ Notifications push
- ✅ Diffusion d'informations

### 🚨 Gestion des Interventions
- ✅ Saisie en temps réel
- ✅ Géolocalisation
- ✅ Suivi des affaires
- ✅ Statistiques

### 📊 Grades et Hiérarchie
- ✅ Structure militaire complète
- ✅ Gestion des avancements
- ✅ Calculs automatiques

### 📋 Rapports et PV
- ✅ Templates standardisés
- ✅ Génération PDF
- ✅ Signatures numériques

### 🔍 Objets Trouvés
- ✅ Catalogage avec photos
- ✅ Recherche avancée
- ✅ Restitution tracée

### 🏢 Accueil et Visites
- ✅ Registre des visiteurs
- ✅ Contrôle d'accès
- ✅ Badges temporaires

### 🚦 Verbalisations Électroniques
- ✅ PV numériques
- ✅ Photos d'infractions
- ✅ Transmission automatique

### 🕵️ Fiches de Renseignement
- ✅ Base de données sécurisée
- ✅ Recherche multi-critères
- ✅ Accès restreint

### 🚗 Reconnaissance Moyens Roulants
- ✅ Base véhicules complète
- ✅ Photos multiples (face, documents)
- ✅ Recherche par plaque/modèle

### 📈 Statistiques et SIG
- ✅ Tableaux de bord interactifs
- ✅ Cartes Gabon avec coordonnées GPS
- ✅ Analyses prédictives

### ⚙️ Paramètres Système
- ✅ Configuration centralisée
- ✅ Gestion des utilisateurs
- ✅ Sauvegarde/restauration

---

## 🛠️ TECHNOLOGIES UTILISÉES

### Frontend 📱
- **Angular 17** - Framework moderne
- **TypeScript** - Langage typé
- **Angular Material** - Composants UI
- **Bootstrap 5** - Framework CSS responsive
- **Leaflet** - Cartographie interactive
- **Socket.IO** - Communication temps réel
- **PWA** - Application web progressive

### Backend 🔧
- **Node.js 18+** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL 8** - Base de données
- **Sequelize** - ORM moderne
- **JWT** - Authentification sécurisée
- **Multer** - Gestion uploads
- **Socket.IO** - WebSockets

### Déploiement 🐳
- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration
- **Nginx** - Proxy reverse
- **PM2** - Gestionnaire processus

---

## 🚀 INSTALLATION RAPIDE

### Option 1 : Installation Localhost (Tests)

```bash
# 1. Cloner le projet
git clone https://github.com/police-gabon/main-courante.git
cd main-courante

# 2. Installation automatique
chmod +x scripts/install-localhost.sh
./scripts/install-localhost.sh

# 3. Démarrer l'application
./start.sh
```

### Option 2 : Installation Docker (Production)

```bash
# 1. Suivre le guide détaillé
./DOCKER_UBUNTU_INSTALLATION.md

# 2. Ou installation rapide
npm run setup:docker
```

---

## 📱 ACCÈS APPLICATION

### URLs
- **Frontend** : http://localhost:4200
- **API Backend** : http://localhost:3000
- **Documentation API** : http://localhost:3000/api-docs

### Comptes de test
- **Administrateur** : admin@police.ga / Admin@123456
- **Agent** : agent@police.ga / Agent@123456

---

## 📖 GUIDES D'INSTALLATION

### 🐳 Docker Ubuntu (Recommandé Production)
**Guide complet** : [DOCKER_UBUNTU_INSTALLATION.md](./DOCKER_UBUNTU_INSTALLATION.md)

- Installation Docker Engine
- Configuration base de données
- Déploiement automatisé
- Monitoring et maintenance
- Sécurisation complète

### 💻 Installation Localhost (Tests/Développement)
**Script automatique** : `./scripts/install-localhost.sh`

- Détection automatique OS
- Installation Node.js/MySQL
- Configuration automatique
- Démarrage immédiat

---

## 📱 INTERFACE MOBILE/TABLETTE

### Fonctionnalités mobiles
- ✅ **Design responsive** mobile-first
- ✅ **PWA** installable sur smartphone
- ✅ **Touch-friendly** interface tactile optimisée
- ✅ **Offline** fonctionnement hors ligne
- ✅ **Géolocalisation** intégrée
- ✅ **Caméra** pour photos directes
- ✅ **Notifications** push natives

### Breakpoints responsive
- **Mobile** : 320px - 768px
- **Tablette** : 768px - 1024px
- **Desktop** : 1024px+

### Installation PWA
1. Ouvrir l'application dans Chrome mobile
2. Menu → "Ajouter à l'écran d'accueil"
3. L'icône apparaît comme une app native

---

## 🏗️ STRUCTURE DU PROJET

```
police-main-courante-gabon/
├── 📁 backend/                    # API Node.js
│   ├── 📁 controllers/           # Contrôleurs métier
│   ├── 📁 models/               # Modèles Sequelize
│   ├── 📁 routes/               # Routes API
│   ├── 📁 middleware/           # Middlewares
│   ├── 📁 services/             # Services métier
│   ├── 📁 uploads/              # Fichiers uploadés
│   └── 📄 server.js            # Point d'entrée
│
├── 📁 frontend/                   # Interface Angular
│   ├── 📁 src/app/
│   │   ├── 📁 core/             # Services core
│   │   ├── 📁 shared/           # Composants partagés
│   │   ├── 📁 features/         # Modules métier
│   │   └── 📁 assets/           # Ressources statiques
│   ├── 📄 package.json
│   └── 📄 angular.json
│
├── 📁 database/                   # Scripts SQL
│   ├── 📄 schema.sql            # Structure base
│   ├── 📄 data-gabon.sql        # Données Gabon
│   └── 📄 init.sql              # Initialisation
│
├── 📁 scripts/                    # Scripts utilitaires
│   ├── 📄 install-localhost.sh  # Installation locale
│   ├── 📄 backup.sh             # Sauvegarde
│   └── 📄 deploy.sh             # Déploiement
│
├── 📁 docker/                     # Configuration Docker
│   ├── 📄 Dockerfile.backend
│   ├── 📄 Dockerfile.frontend
│   └── 📄 nginx.conf
│
├── 📄 docker-compose.yml         # Orchestration Docker
├── 📄 package.json              # Configuration projet
├── 📄 README.md                 # Ce fichier
└── 📄 DOCKER_UBUNTU_INSTALLATION.md  # Guide Docker
```

---

## 🔧 COMMANDES UTILES

### Développement
```bash
# Installer toutes les dépendances
npm run install:all

# Démarrer en mode développement
npm run dev

# Tests
npm run test

# Linting
npm run lint

# Build production
npm run build
```

### Docker
```bash
# Build des images
npm run docker:build

# Démarrer les services
npm run docker:up

# Arrêter les services
npm run docker:down

# Voir les logs
npm run docker:logs
```

### Maintenance
```bash
# Sauvegarde
npm run backup

# Restauration
npm run restore

# Nettoyage
npm run clean
```

---

## 🌍 DONNÉES GABON

### Coordonnées GPS intégrées
- **Libreville** : 0.4162, 9.4673
- **Port-Gentil** : -0.7193, 8.7815
- **Franceville** : -1.6331, 13.5833
- **Oyem** : 1.5993, 11.5804
- **Moanda** : -1.5615, 13.1961

### Structure administrative
- **9 Provinces** avec coordonnées
- **Départements** et **Communes**
- **Commissariats** géolocalisés
- **Directions spécialisées**

---

## 🔐 SÉCURITÉ

### Authentification
- ✅ JWT tokens sécurisés
- ✅ Hashage bcrypt mots de passe
- ✅ Sessions persistantes
- ✅ Limitation tentatives connexion

### Autorisation
- ✅ Rôles hiérarchiques
- ✅ Permissions granulaires
- ✅ Accès basé sur l'affectation
- ✅ Audit trail complet

### Protection données
- ✅ Chiffrement en transit (HTTPS)
- ✅ Chiffrement au repos
- ✅ Sanitization des entrées
- ✅ Protection CSRF/XSS

---

## 📊 PERFORMANCES

### Optimisations frontend
- ✅ Lazy loading modules
- ✅ OnPush change detection
- ✅ Tree shaking automatique
- ✅ Compression Gzip
- ✅ Cache agressif assets

### Optimisations backend
- ✅ Connection pooling MySQL
- ✅ Cache Redis
- ✅ Compression responses
- ✅ Rate limiting
- ✅ Query optimization

---

## 🧪 TESTS

### Frontend
```bash
cd frontend
npm test                 # Tests unitaires
npm run e2e             # Tests end-to-end
npm run test:coverage   # Couverture de code
```

### Backend
```bash
cd backend
npm test                 # Tests API
npm run test:integration # Tests intégration
npm run test:load       # Tests de charge
```

---

## 📞 SUPPORT

### Contact
- **Email** : support.police@gabon.ga
- **Téléphone** : +241 XX XX XX XX
- **Bureau** : Direction Générale Police Nationale

### Documentation
- **API** : http://localhost:3000/api-docs
- **Guide utilisateur** : docs/user-guide.pdf
- **Guide admin** : docs/admin-guide.pdf

### Dépannage
1. Vérifier les logs : `docker-compose logs`
2. Redémarrer les services : `docker-compose restart`
3. Consulter le guide troubleshooting

---

## 🔄 MISES À JOUR

### Versions
- **v2.0.0** - Interface mobile + modules avancés
- **v1.5.0** - Module véhicules + cartographie
- **v1.0.0** - Version initiale

### Roadmap
- **v2.1** - IA prédictive
- **v2.2** - API mobile native
- **v2.3** - Blockchain audit trail

---

## 📜 LICENCE

**Propriétaire** - Police Nationale Gabonaise

Ce logiciel est la propriété exclusive de la Police Nationale Gabonaise. Toute utilisation, modification ou distribution non autorisée est strictement interdite.

---

## 🎯 DÉMARRAGE RAPIDE

### 1️⃣ Installation en 5 minutes

```bash
# Télécharger
git clone https://github.com/police-gabon/main-courante.git
cd main-courante

# Installer (automatique)
./scripts/install-localhost.sh

# Démarrer
./start.sh
```

### 2️⃣ Accès immédiat

- 🌐 **Application** : http://localhost:4200
- 👤 **Login** : admin@police.ga / Admin@123456
- 📱 **Mobile** : Même URL, interface adaptée

### 3️⃣ Test des fonctionnalités

1. **Dashboard** - Vue d'ensemble
2. **Effectifs** - Gestion personnel
3. **Interventions** - Nouvelle intervention
4. **Carte** - Visualisation Gabon
5. **Véhicules** - Base de données

---

**🚔 Développé avec ❤️ pour la Police Nationale Gabonaise 🇬🇦**

*"Au service de la sécurité et de la modernisation des forces de l'ordre gabonaises"*

