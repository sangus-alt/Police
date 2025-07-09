const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  expediteur_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  destinataire_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Si null, le message est pour un groupe ou diffusion générale'
  },
  poste_destinataire_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'postes',
      key: 'id'
    },
    comment: 'Destinataire par poste pour diffusion'
  },
  type: {
    type: DataTypes.ENUM('chat', 'notification', 'urgence', 'info', 'directive', 'demande'),
    allowNull: false,
    defaultValue: 'chat'
  },
  canal: {
    type: DataTypes.ENUM('prive', 'groupe', 'poste', 'general', 'urgence'),
    allowNull: false,
    defaultValue: 'prive'
  },
  sujet: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 5000]
    }
  },
  priorite: {
    type: DataTypes.ENUM('faible', 'normale', 'haute', 'urgente'),
    allowNull: false,
    defaultValue: 'normale'
  },
  statut: {
    type: DataTypes.ENUM('envoye', 'lu', 'repondu', 'archive', 'supprime'),
    allowNull: false,
    defaultValue: 'envoye'
  },
  date_lecture: {
    type: DataTypes.DATE,
    allowNull: true
  },
  accusee_reception: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  reponse_requise: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  date_limite_reponse: {
    type: DataTypes.DATE,
    allowNull: true
  },
  message_parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'messages',
      key: 'id'
    },
    comment: 'ID du message parent pour les réponses'
  },
  pieces_jointes: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Fichiers joints au message'
  },
  localisation: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Coordonnées GPS si message géolocalisé'
  },
  intervention_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'interventions',
      key: 'id'
    },
    comment: 'Lié à une intervention spécifique'
  },
  diffusion_groupe: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Liste des IDs des destinataires pour diffusion de groupe'
  },
  notification_sms: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  notification_email: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  date_envoi_sms: {
    type: DataTypes.DATE,
    allowNull: true
  },
  date_envoi_email: {
    type: DataTypes.DATE,
    allowNull: true
  },
  signature_numerique: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Signature numérique pour les messages officiels'
  },
  niveau_confidentialite: {
    type: DataTypes.ENUM('public', 'interne', 'confidentiel', 'secret'),
    allowNull: false,
    defaultValue: 'interne'
  },
  reference_externe: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Référence vers un document ou dossier externe'
  }
}, {
  tableName: 'messages',
  indexes: [
    {
      fields: ['expediteur_id', 'created_at']
    },
    {
      fields: ['destinataire_id', 'statut']
    },
    {
      fields: ['type', 'priorite']
    },
    {
      fields: ['canal']
    },
    {
      fields: ['intervention_id']
    }
  ]
});

// Associations
Message.associate = function(models) {
  Message.belongsTo(models.User, {
    foreignKey: 'expediteur_id',
    as: 'expediteur'
  });
  
  Message.belongsTo(models.User, {
    foreignKey: 'destinataire_id',
    as: 'destinataire'
  });
  
  Message.belongsTo(models.Poste, {
    foreignKey: 'poste_destinataire_id',
    as: 'poste_destinataire'
  });
  
  Message.belongsTo(models.Intervention, {
    foreignKey: 'intervention_id',
    as: 'intervention'
  });
  
  Message.belongsTo(models.Message, {
    foreignKey: 'message_parent_id',
    as: 'message_parent'
  });
  
  Message.hasMany(models.Message, {
    foreignKey: 'message_parent_id',
    as: 'reponses'
  });
};

// Méthodes d'instance
Message.prototype.marquerCommeLu = function(userId) {
  if (this.destinataire_id === userId || this.diffusion_groupe?.includes(userId)) {
    this.statut = 'lu';
    this.date_lecture = new Date();
    return this.save();
  }
  return false;
};

Message.prototype.estUrgent = function() {
  return this.priorite === 'urgente' || this.type === 'urgence';
};

Message.prototype.necessiteReponse = function() {
  return this.reponse_requise && this.statut !== 'repondu';
};

Message.prototype.estEnRetard = function() {
  if (!this.date_limite_reponse || this.statut === 'repondu') return false;
  return new Date() > this.date_limite_reponse;
};

Message.prototype.peutEtreLuPar = function(userId) {
  // Vérifier si l'utilisateur peut lire ce message
  if (this.destinataire_id === userId) return true;
  if (this.expediteur_id === userId) return true;
  if (this.diffusion_groupe?.includes(userId)) return true;
  if (this.canal === 'general') return true;
  
  return false;
};

Message.prototype.genererAccuseReception = function() {
  if (!this.accusee_reception) return null;
  
  return {
    expediteur_id: this.destinataire_id,
    destinataire_id: this.expediteur_id,
    type: 'notification',
    canal: 'prive',
    sujet: `Accusé de réception - ${this.sujet || 'Message'}`,
    contenu: `Message reçu et lu le ${new Date().toLocaleString('fr-FR')}`,
    message_parent_id: this.id
  };
};

// Méthodes de classe
Message.findConversation = function(user1Id, user2Id, limit = 50) {
  return this.findAll({
    where: {
      [Op.or]: [
        { expediteur_id: user1Id, destinataire_id: user2Id },
        { expediteur_id: user2Id, destinataire_id: user1Id }
      ]
    },
    order: [['created_at', 'DESC']],
    limit,
    include: [
      { model: sequelize.models.User, as: 'expediteur', attributes: ['id', 'nom', 'prenoms'] },
      { model: sequelize.models.User, as: 'destinataire', attributes: ['id', 'nom', 'prenoms'] }
    ]
  });
};

Message.findMessagesNonLus = function(userId) {
  return this.findAll({
    where: {
      [Op.or]: [
        { destinataire_id: userId, statut: 'envoye' },
        { 
          diffusion_groupe: {
            [Op.contains]: [userId]
          },
          statut: 'envoye'
        }
      ]
    },
    order: [['created_at', 'DESC']]
  });
};

module.exports = Message;