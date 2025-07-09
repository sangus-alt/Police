const { Sequelize } = require('sequelize');
const logger = require('./logger');
require('dotenv').config();

// Configuration de la base de données
const sequelize = new Sequelize(
  process.env.DB_NAME || 'police_main_courante',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    },
    timezone: '+01:00' // Fuseau horaire du Gabon
  }
);

// Test de connexion
async function testConnection() {
  try {
    await sequelize.authenticate();
    logger.info('✅ Connexion à la base de données établie avec succès.');
    return true;
  } catch (error) {
    logger.error('❌ Impossible de se connecter à la base de données:', error.message);
    return false;
  }
}

module.exports = {
  sequelize,
  testConnection
};