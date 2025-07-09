const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Intervention = sequelize.define('Intervention', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'Numéro unique de l\'intervention'
  },
  type: {
    type: DataTypes.ENUM(
      'accident_circulation', 'vol', 'agression', 'cambriolage', 'violence_conjugale',
      'trouble_ordre_public', 'urgence_medicale', 'incendie', 'disparition',
      'controle_routine', 'manifestation', 'autre'
    ),
    allowNull: false
  },
  priorite: {
    type: DataTypes.ENUM('faible', 'normale', 'haute', 'urgente', 'critique'),
    allowNull: false,
    defaultValue: 'normale'
  },
  statut: {
    type: DataTypes.ENUM('en_attente', 'assignee', 'en_cours', 'terminee', 'annulee', 'suspendue'),
    allowNull: false,
    defaultValue: 'en_attente'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [10, 2000]
    }
  },
  adresse: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    validate: {
      min: -90,
      max: 90
    }
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    validate: {
      min: -180,
      max: 180
    }
  },
  poste_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'postes',
      key: 'id'
    }
  },
  responsable_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Agent responsable de l\'intervention'
  },
  equipe_assignee: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Liste des IDs des agents assignés à l\'intervention'
  },
  demandeur_nom: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  demandeur_telephone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  demandeur_email: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  temoin_present: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  temoins: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Liste des témoins présents'
  },
  victimes: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Informations sur les victimes'
  },
  suspects: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Informations sur les suspects'
  },
  vehicules_impliques: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Véhicules impliqués dans l\'intervention'
  },
  date_signalement: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  date_assignation: {
    type: DataTypes.DATE,
    allowNull: true
  },
  date_arrivee: {
    type: DataTypes.DATE,
    allowNull: true
  },
  date_fin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  duree_intervention: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Durée en minutes'
  },
  mesures_prises: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pieces_jointes: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Photos, documents joints à l\'intervention'
  },
  rapport_genere: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  cloture_automatique: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  code_penal: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Code de l\'infraction selon le code pénal'
  },
  gravite: {
    type: DataTypes.ENUM('mineure', 'moyenne', 'grave', 'tres_grave'),
    allowNull: false,
    defaultValue: 'moyenne'
  },
  suivi_medical: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  suivi_judiciaire: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'interventions',
  hooks: {
    beforeCreate: async (intervention) => {
      if (!intervention.numero) {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        
        const count = await Intervention.count({
          where: sequelize.where(
            sequelize.fn('DATE', sequelize.col('created_at')),
            today.toISOString().split('T')[0]
          )
        });
        
        intervention.numero = `INT${year}${month}${day}${(count + 1).toString().padStart(4, '0')}`;
      }
    }
  },
  indexes: [
    {
      fields: ['numero']
    },
    {
      fields: ['statut', 'priorite']
    },
    {
      fields: ['poste_id', 'date_signalement']
    },
    {
      fields: ['type']
    },
    {
      fields: ['latitude', 'longitude']
    }
  ]
});

// Associations
Intervention.associate = function(models) {
  Intervention.belongsTo(models.Poste, {
    foreignKey: 'poste_id',
    as: 'poste'
  });
  
  Intervention.belongsTo(models.User, {
    foreignKey: 'responsable_id',
    as: 'responsable'
  });
  
  Intervention.belongsTo(models.User, {
    foreignKey: 'created_by',
    as: 'createur'
  });
  
  Intervention.hasMany(models.Rapport, {
    foreignKey: 'intervention_id',
    as: 'rapports'
  });
};

// Méthodes d'instance
Intervention.prototype.calculerDistance = function(latitude, longitude) {
  if (!this.latitude || !this.longitude) return null;
  
  const R = 6371; // Rayon de la Terre en km
  const dLat = (latitude - this.latitude) * Math.PI / 180;
  const dLon = (longitude - this.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.latitude * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

Intervention.prototype.assignerEquipe = function(agentIds, responsableId) {
  this.equipe_assignee = agentIds;
  this.responsable_id = responsableId;
  this.date_assignation = new Date();
  this.statut = 'assignee';
  return this.save();
};

Intervention.prototype.marquerArrivee = function() {
  this.date_arrivee = new Date();
  this.statut = 'en_cours';
  return this.save();
};

Intervention.prototype.terminer = function(mesuresPrises, observations = null) {
  this.date_fin = new Date();
  this.statut = 'terminee';
  this.mesures_prises = mesuresPrises;
  if (observations) {
    this.observations = observations;
  }
  
  // Calcul de la durée
  if (this.date_arrivee) {
    this.duree_intervention = Math.floor((this.date_fin - this.date_arrivee) / 60000);
  }
  
  return this.save();
};

Intervention.prototype.estUrgente = function() {
  return ['urgente', 'critique'].includes(this.priorite);
};

Intervention.prototype.getCoordinates = function() {
  if (!this.latitude || !this.longitude) return null;
  return {
    latitude: parseFloat(this.latitude),
    longitude: parseFloat(this.longitude)
  };
};

module.exports = Intervention;