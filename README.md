# Logiciel de Main Courante des Forces de l'Ordre - Gabon

## Description
Système complet de gestion de la main courante des forces de l'ordre du Gabon avec tous les modules demandés.

## Architecture
- **Backend**: Node.js/Express avec API REST
- **Frontend**: Angular 17 avec interface moderne
- **Base de données**: MySQL
- **Cartographie**: OpenStreetMap
- **Temps réel**: Socket.IO

## Modules implémentés
1. Gestion des effectifs
2. Tableaux de garde
3. Communication interne
4. Gestion des interventions
5. Gestion des grades
6. Procès-verbaux et rapports
7. Objets perdus/trouvés
8. Accueil et visites
9. Verbalisation électronique
10. Fiches de renseignements
11. Reconnaissance moyens roulants
12. Statistiques avec SIG
13. Paramètres système

## Installation
```bash
# Installation des dépendances
npm run install:all

# Démarrage en développement
npm run dev:all

# Démarrage en production
npm run docker:up
```

## Configuration
Copier .env.example vers .env et configurer les variables d'environnement.

## Déploiement
Le système peut être déployé sur Ubuntu, CentOS ou Windows Server.

