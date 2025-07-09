const winston = require('winston');
const path = require('path');

// Configuration des niveaux de log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Couleurs pour les niveaux
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Ajout des couleurs à winston
winston.addColors(colors);

// Format des logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Transports
const transports = [
  // Console transport
  new winston.transports.Console(),
  
  // Fichier d'erreurs
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/error.log'),
    level: 'error',
  }),
  
  // Fichier de tous les logs
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/all.log'),
  }),
];

// Création du logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
  levels,
  format,
  transports,
});

module.exports = logger;