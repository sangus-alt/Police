const { sequelize, testConnection } = require('./database');
const logger = require('./logger');

// Import de tous les modèles
const User = require('../models/User');
const Poste = require('../models/Poste');
const Agent = require('../models/Agent');
const Grade = require('../models/Grade');
const Garde = require('../models/Garde');
const Intervention = require('../models/Intervention');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const Rapport = require('../models/Rapport');
const ObjetPerdu = require('../models/ObjetPerdu');
const Visite = require('../models/Visite');
const Verbalisation = require('../models/Verbalisation');
const FicheRenseignement = require('../models/FicheRenseignement');
const Vehicule = require('../models/Vehicule');
const RendezVous = require('../models/RendezVous');

// Fonction d'initialisation de la base de données
async function initializeDatabase() {
  try {
    // Test de connexion
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Impossible de se connecter à la base de données');
    }

    // Synchronisation des modèles avec la base de données
    logger.info('🔄 Synchronisation des modèles avec la base de données...');
    
    await sequelize.sync({ 
      force: process.env.NODE_ENV === 'development' && process.env.FORCE_SYNC === 'true',
      alter: process.env.NODE_ENV === 'development'
    });
    
    logger.info('✅ Synchronisation des modèles terminée avec succès');

    // Création des données de base (grades, postes par défaut, etc.)
    await createDefaultData();
    
    logger.info('✅ Initialisation de la base de données terminée');
    
  } catch (error) {
    logger.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}

// Création des données par défaut
async function createDefaultData() {
  try {
    // Création des grades par défaut
    const grades = [
      { nom: 'Commissaire Divisionnaire', niveau: 10, description: 'Grade le plus élevé' },
      { nom: 'Commissaire', niveau: 9, description: 'Commissaire de police' },
      { nom: 'Commissaire Adjoint', niveau: 8, description: 'Commissaire adjoint' },
      { nom: 'Commandant', niveau: 7, description: 'Commandant de police' },
      { nom: 'Capitaine', niveau: 6, description: 'Capitaine de police' },
      { nom: 'Lieutenant', niveau: 5, description: 'Lieutenant de police' },
      { nom: 'Sous-Lieutenant', niveau: 4, description: 'Sous-lieutenant de police' },
      { nom: 'Adjudant-Chef', niveau: 3, description: 'Adjudant-chef' },
      { nom: 'Adjudant', niveau: 2, description: 'Adjudant de police' },
      { nom: 'Sergent-Chef', niveau: 1, description: 'Sergent-chef' },
      { nom: 'Sergent', niveau: 0, description: 'Sergent de police' }
    ];

    for (const grade of grades) {
      await Grade.findOrCreate({
        where: { nom: grade.nom },
        defaults: grade
      });
    }

    // Création des postes par défaut (principales villes du Gabon)
    const postes = [
      { 
        nom: 'Commissariat Central Libreville', 
        ville: 'Libreville', 
        province: 'Estuaire',
        latitude: 0.4162, 
        longitude: 9.4673,
        telephone: '+241-01-00-00-00',
        adresse: 'Avenue du Colonel Parant, Libreville'
      },
      { 
        nom: 'Commissariat Port-Gentil', 
        ville: 'Port-Gentil', 
        province: 'Ogooué-Maritime',
        latitude: -0.7193, 
        longitude: 8.7815,
        telephone: '+241-01-00-00-01',
        adresse: 'Boulevard Léon Mba, Port-Gentil'
      },
      { 
        nom: 'Commissariat Franceville', 
        ville: 'Franceville', 
        province: 'Haut-Ogooué',
        latitude: -1.6343, 
        longitude: 13.5833,
        telephone: '+241-01-00-00-02',
        adresse: 'Avenue Omar Bongo, Franceville'
      },
      { 
        nom: 'Commissariat Oyem', 
        ville: 'Oyem', 
        province: 'Woleu-Ntem',
        latitude: 1.5993, 
        longitude: 11.5793,
        telephone: '+241-01-00-00-03',
        adresse: 'Route Nationale 2, Oyem'
      },
      { 
        nom: 'Commissariat Lambaréné', 
        ville: 'Lambaréné', 
        province: 'Moyen-Ogooué',
        latitude: -0.7002, 
        longitude: 10.2411,
        telephone: '+241-01-00-00-04',
        adresse: 'Avenue Albert Schweitzer, Lambaréné'
      }
    ];

    for (const poste of postes) {
      await Poste.findOrCreate({
        where: { nom: poste.nom },
        defaults: poste
      });
    }

    // Création de l'utilisateur administrateur par défaut
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@police.ga';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
    
    const [adminUser, created] = await User.findOrCreate({
      where: { email: adminEmail },
      defaults: {
        nom: 'Administrateur',
        prenoms: 'Système',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        statut: 'actif',
        telephone: '+241-00-00-00-00'
      }
    });

    if (created) {
      logger.info(`👤 Utilisateur administrateur créé: ${adminEmail}`);
    }

    logger.info('✅ Données par défaut créées avec succès');
    
  } catch (error) {
    logger.error('❌ Erreur lors de la création des données par défaut:', error);
    throw error;
  }
}

module.exports = {
  initializeDatabase,
  createDefaultData
};