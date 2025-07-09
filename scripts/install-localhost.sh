#!/bin/bash

# Script d'installation automatique Police Main Courante Gabon - Localhost
# Usage: ./scripts/install-localhost.sh

set -e

# Couleurs pour affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'affichage avec couleur
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                  🚔 POLICE MAIN COURANTE GABON 🇬🇦                ║"
    echo "║                Installation Automatique Localhost           ║"
    echo "║                          Version 2.0                        ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Vérification des prérequis
check_prerequisites() {
    print_status "Vérification des prérequis..."
    
    # Vérifier OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        PLATFORM="linux"
        print_success "Plateforme Linux détectée"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        PLATFORM="macos"
        print_success "Plateforme macOS détectée"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        PLATFORM="windows"
        print_success "Plateforme Windows détectée"
    else
        print_error "Plateforme non supportée: $OSTYPE"
        exit 1
    fi
    
    # Vérifier Node.js
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR" -ge 18 ]; then
            print_success "Node.js $NODE_VERSION détecté"
        else
            print_error "Node.js 18+ requis. Version actuelle: $NODE_VERSION"
            print_status "Installation de Node.js en cours..."
            install_nodejs
        fi
    else
        print_warning "Node.js non trouvé"
        install_nodejs
    fi
    
    # Vérifier MySQL
    if command -v mysql >/dev/null 2>&1; then
        print_success "MySQL détecté"
    else
        print_warning "MySQL non trouvé"
        install_mysql
    fi
    
    # Vérifier Git
    if command -v git >/dev/null 2>&1; then
        print_success "Git détecté"
    else
        print_error "Git requis mais non trouvé"
        install_git
    fi
}

# Installation Node.js selon la plateforme
install_nodejs() {
    print_status "Installation de Node.js 18..."
    
    case $PLATFORM in
        "linux")
            if command -v apt >/dev/null 2>&1; then
                # Ubuntu/Debian
                curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                sudo apt-get install -y nodejs
            elif command -v yum >/dev/null 2>&1; then
                # CentOS/RHEL
                curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
                sudo yum install -y nodejs npm
            else
                print_error "Gestionnaire de paquets non supporté"
                exit 1
            fi
            ;;
        "macos")
            if command -v brew >/dev/null 2>&1; then
                brew install node@18
            else
                print_error "Homebrew requis sur macOS. Installez-le d'abord."
                exit 1
            fi
            ;;
        "windows")
            print_error "Veuillez installer Node.js manuellement depuis https://nodejs.org"
            exit 1
            ;;
    esac
    
    print_success "Node.js installé avec succès"
}

# Installation MySQL selon la plateforme
install_mysql() {
    print_status "Installation de MySQL..."
    
    case $PLATFORM in
        "linux")
            if command -v apt >/dev/null 2>&1; then
                sudo apt update
                sudo apt install -y mysql-server
                sudo systemctl start mysql
                sudo systemctl enable mysql
            elif command -v yum >/dev/null 2>&1; then
                sudo yum install -y mysql-server
                sudo systemctl start mysqld
                sudo systemctl enable mysqld
            fi
            ;;
        "macos")
            brew install mysql
            brew services start mysql
            ;;
        "windows")
            print_error "Veuillez installer MySQL manuellement"
            exit 1
            ;;
    esac
    
    print_success "MySQL installé avec succès"
}

# Installation Git selon la plateforme
install_git() {
    print_status "Installation de Git..."
    
    case $PLATFORM in
        "linux")
            if command -v apt >/dev/null 2>&1; then
                sudo apt install -y git
            elif command -v yum >/dev/null 2>&1; then
                sudo yum install -y git
            fi
            ;;
        "macos")
            # Git est généralement préinstallé sur macOS
            xcode-select --install 2>/dev/null || true
            ;;
        "windows")
            print_error "Veuillez installer Git manuellement"
            exit 1
            ;;
    esac
    
    print_success "Git installé avec succès"
}

# Configuration de la base de données
setup_database() {
    print_status "Configuration de la base de données MySQL..."
    
    # Variables de configuration
    DB_NAME="police_main_courante"
    DB_USER="police_user"
    DB_PASSWORD="SecurePassword123!"
    
    print_status "Création de la base de données et de l'utilisateur..."
    
    # Script SQL temporaire
    cat > /tmp/setup_db.sql <<EOF
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
SELECT 'Base de données configurée avec succès!' as message;
EOF
    
    # Exécuter le script
    if mysql -u root -p < /tmp/setup_db.sql; then
        print_success "Base de données configurée avec succès"
    else
        print_warning "Tentative sans mot de passe root..."
        if mysql -u root < /tmp/setup_db.sql; then
            print_success "Base de données configurée avec succès"
        else
            print_error "Erreur lors de la configuration de la base de données"
            print_status "Veuillez configurer MySQL manuellement:"
            print_status "1. Exécutez: mysql -u root -p"
            print_status "2. Copiez-collez le contenu de /tmp/setup_db.sql"
            exit 1
        fi
    fi
    
    # Nettoyer le fichier temporaire
    rm -f /tmp/setup_db.sql
}

# Configuration des variables d'environnement
setup_environment() {
    print_status "Configuration des variables d'environnement..."
    
    # Créer le fichier .env pour le backend
    cat > backend/.env <<EOF
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
EMAIL_USER=
EMAIL_PASSWORD=

# Configuration Admin par défaut
ADMIN_EMAIL=admin@police.ga
ADMIN_PASSWORD=Admin@123456

# Configuration uploads
UPLOAD_PATH=./uploads
UPLOAD_MAX_SIZE=10485760

# Logging
LOG_LEVEL=debug
EOF
    
    print_success "Variables d'environnement configurées"
}

# Installation des dépendances
install_dependencies() {
    print_status "Installation des dépendances..."
    
    # Backend
    print_status "Installation des dépendances backend..."
    cd backend
    if [ -f "package.json" ]; then
        npm install
        print_success "Dépendances backend installées"
    else
        print_error "package.json introuvable dans le dossier backend"
        exit 1
    fi
    cd ..
    
    # Frontend
    print_status "Installation des dépendances frontend..."
    cd frontend
    if [ -f "package.json" ]; then
        npm install
        print_success "Dépendances frontend installées"
    else
        print_error "package.json introuvable dans le dossier frontend"
        exit 1
    fi
    cd ..
}

# Initialisation de la base de données
init_database() {
    print_status "Initialisation de la base de données..."
    
    cd backend
    if [ -f "scripts/init-db.js" ]; then
        node scripts/init-db.js
        print_success "Base de données initialisée"
    else
        print_warning "Script d'initialisation non trouvé. La base sera créée au premier démarrage."
    fi
    cd ..
}

# Création des scripts de démarrage
create_scripts() {
    print_status "Création des scripts de démarrage..."
    
    # Script de démarrage complet
    cat > start.sh <<'EOF'
#!/bin/bash

echo "🚔 Démarrage Police Main Courante Gabon..."

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Démarrer backend
echo -e "${BLUE}Démarrage du backend...${NC}"
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Attendre que le backend soit prêt
echo -e "${BLUE}Attente du backend...${NC}"
sleep 5

# Démarrer frontend
echo -e "${BLUE}Démarrage du frontend...${NC}"
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo -e "${GREEN}✅ Application démarrée avec succès!${NC}"
echo -e "${GREEN}🌐 Frontend: http://localhost:4200${NC}"
echo -e "${GREEN}🔗 Backend API: http://localhost:3000${NC}"
echo -e "${GREEN}👤 Admin: admin@police.ga / Admin@123456${NC}"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter l'application"

# Fonction pour arrêter proprement
cleanup() {
    echo -e "\n${BLUE}Arrêt de l'application...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Attendre les processus
wait $BACKEND_PID $FRONTEND_PID
EOF
    
    chmod +x start.sh
    
    # Script de développement
    cat > start-dev.sh <<'EOF'
#!/bin/bash

echo "🚔 Démarrage Police Main Courante Gabon (Mode développement)..."

# Ouvrir plusieurs terminaux pour dev
if command -v gnome-terminal >/dev/null 2>&1; then
    gnome-terminal --tab --title="Backend" -- bash -c "cd backend && npm run dev; bash"
    gnome-terminal --tab --title="Frontend" -- bash -c "cd frontend && npm start; bash"
elif command -v terminator >/dev/null 2>&1; then
    terminator -e "cd backend && npm run dev" &
    terminator -e "cd frontend && npm start" &
else
    echo "Démarrez manuellement:"
    echo "Terminal 1: cd backend && npm run dev"
    echo "Terminal 2: cd frontend && npm start"
fi
EOF
    
    chmod +x start-dev.sh
    
    # Script d'arrêt
    cat > stop.sh <<'EOF'
#!/bin/bash

echo "🛑 Arrêt Police Main Courante Gabon..."

# Tuer tous les processus Node.js du projet
pkill -f "node.*police"
pkill -f "ng serve"

echo "✅ Application arrêtée"
EOF
    
    chmod +x stop.sh
    
    print_success "Scripts de démarrage créés"
}

# Tests de validation
run_tests() {
    print_status "Exécution des tests de validation..."
    
    # Test base de données
    if mysql -u police_user -pSecurePassword123! -e "USE police_main_courante; SELECT 'DB OK' as status;" >/dev/null 2>&1; then
        print_success "✅ Connexion base de données OK"
    else
        print_error "❌ Problème de connexion base de données"
        return 1
    fi
    
    # Test dépendances backend
    cd backend
    if npm list >/dev/null 2>&1; then
        print_success "✅ Dépendances backend OK"
    else
        print_warning "⚠️  Problème avec les dépendances backend"
    fi
    cd ..
    
    # Test dépendances frontend
    cd frontend
    if npm list >/dev/null 2>&1; then
        print_success "✅ Dépendances frontend OK"
    else
        print_warning "⚠️  Problème avec les dépendances frontend"
    fi
    cd ..
    
    print_success "Tests de validation terminés"
}

# Fonction principale
main() {
    print_header
    
    print_status "Début de l'installation..."
    
    # Vérifier que nous sommes dans le bon répertoire
    if [ ! -f "package.json" ] && [ ! -d "backend" ] && [ ! -d "frontend" ]; then
        print_error "Ce script doit être exécuté depuis la racine du projet"
        print_status "Structure attendue:"
        print_status "  ├── backend/"
        print_status "  ├── frontend/"
        print_status "  └── scripts/install-localhost.sh"
        exit 1
    fi
    
    # Étapes d'installation
    check_prerequisites
    setup_database
    setup_environment
    install_dependencies
    init_database
    create_scripts
    run_tests
    
    print_success "🎉 Installation terminée avec succès!"
    echo ""
    print_status "📋 Prochaines étapes:"
    print_status "1. Démarrer l'application: ./start.sh"
    print_status "2. Ou en mode développement: ./start-dev.sh"
    print_status "3. Accéder à l'application: http://localhost:4200"
    print_status "4. Se connecter avec: admin@police.ga / Admin@123456"
    echo ""
    print_status "📁 Scripts disponibles:"
    print_status "  ./start.sh      - Démarrage production"
    print_status "  ./start-dev.sh  - Démarrage développement"
    print_status "  ./stop.sh       - Arrêt de l'application"
    echo ""
    print_warning "⚠️  En cas de problème, consultez les logs ou contactez le support."
    
    # Proposer de démarrer immédiatement
    echo ""
    read -p "Voulez-vous démarrer l'application maintenant? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Démarrage de l'application..."
        ./start.sh
    fi
}

# Gestion des erreurs
handle_error() {
    print_error "Une erreur s'est produite à la ligne $1"
    print_status "Vérifiez les logs ci-dessus pour plus d'informations"
    exit 1
}

trap 'handle_error $LINENO' ERR

# Exécuter le script principal
main "$@"