const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Import des modules
const { sequelize } = require('./config/database');
const logger = require('./config/logger');
const { initializeDatabase } = require('./config/init');

// Import des routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const effectifRoutes = require('./routes/effectifs');
const gardeRoutes = require('./routes/gardes');
const communicationRoutes = require('./routes/communication');
const interventionRoutes = require('./routes/interventions');
const gradeRoutes = require('./routes/grades');
const rapportRoutes = require('./routes/rapports');
const objetRoutes = require('./routes/objets');
const accueilRoutes = require('./routes/accueil');
const verbalisationRoutes = require('./routes/verbalisation');
const renseignementRoutes = require('./routes/renseignements');
const vehiculeRoutes = require('./routes/vehicules');
const statistiqueRoutes = require('./routes/statistiques');
const parametreRoutes = require('./routes/parametres');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

// Configuration de base
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Trop de requêtes, veuillez réessayer plus tard.'
  }
});

app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:4200",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'police-secret-key',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  }
}));

// Static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/effectifs', effectifRoutes);
app.use('/api/gardes', gardeRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/interventions', interventionRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/rapports', rapportRoutes);
app.use('/api/objets', objetRoutes);
app.use('/api/accueil', accueilRoutes);
app.use('/api/verbalisation', verbalisationRoutes);
app.use('/api/renseignements', renseignementRoutes);
app.use('/api/vehicules', vehiculeRoutes);
app.use('/api/statistiques', statistiqueRoutes);
app.use('/api/parametres', parametreRoutes);

// Socket.IO pour la communication temps réel
io.on('connection', (socket) => {
  logger.info(`Utilisateur connecté: ${socket.id}`);

  // Rejoindre une room basée sur le poste
  socket.on('join-poste', (posteId) => {
    socket.join(`poste-${posteId}`);
    logger.info(`Socket ${socket.id} a rejoint le poste ${posteId}`);
  });

  // Gestion des messages de chat
  socket.on('send-message', (data) => {
    socket.to(`poste-${data.posteId}`).emit('new-message', data);
  });

  // Gestion des notifications d'urgence
  socket.on('emergency-alert', (data) => {
    io.emit('emergency-notification', data);
  });

  // Gestion des mises à jour d'intervention
  socket.on('intervention-update', (data) => {
    io.emit('intervention-status-change', data);
  });

  socket.on('disconnect', () => {
    logger.info(`Utilisateur déconnecté: ${socket.id}`);
  });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  logger.error('Erreur serveur:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: err.errors
    });
  }
  
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Cette ressource existe déjà'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée'
  });
});

// Initialisation et démarrage du serveur
async function startServer() {
  try {
    await initializeDatabase();
    sessionStore.sync();
    
    server.listen(PORT, () => {
      logger.info(`🚀 Serveur démarré sur le port ${PORT}`);
      logger.info(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`📊 Base de données: ${process.env.DB_NAME}`);
    });
  } catch (error) {
    logger.error('Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
}

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  logger.info('SIGTERM reçu, arrêt gracieux du serveur...');
  server.close(() => {
    logger.info('Serveur fermé');
    sequelize.close();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT reçu, arrêt gracieux du serveur...');
  server.close(() => {
    logger.info('Serveur fermé');
    sequelize.close();
    process.exit(0);
  });
});

startServer();

module.exports = { app, server, io };