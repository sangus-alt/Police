const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Garde = sequelize.define('Garde', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  agent_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
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
  type_garde: {
    type: DataTypes.ENUM('jour', 'nuit', 'weekend', 'ferie', 'permanence'),
    allowNull: false,
    defaultValue: 'jour'
  },
  date_debut: {
    type: DataTypes.DATE,
    allowNull: false
  },
  date_fin: {
    type: DataTypes.DATE,
    allowNull: false
  },
  heure_debut: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: '08:00:00'
  },
  heure_fin: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: '18:00:00'
  },
  statut: {
    type: DataTypes.ENUM('planifie', 'en_cours', 'termine', 'annule', 'absent'),
    allowNull: false,
    defaultValue: 'planifie'
  },
  fonction: {
    type: DataTypes.ENUM('chef_garde', 'adjoint', 'agent_accueil', 'agent_circulation', 'enqueteur_garde', 'agent_standard'),
    allowNull: false,
    defaultValue: 'agent_accueil'
  },
  secteur: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Secteur ou zone de responsabilité pendant la garde'
  },
  remplacant_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Agent remplaçant en cas d\'absence'
  },
  heure_arrivee_reelle: {
    type: DataTypes.TIME,
    allowNull: true,
    comment: 'Heure d\'arrivée réelle de l\'agent'
  },
  heure_depart_reelle: {
    type: DataTypes.TIME,
    allowNull: true,
    comment: 'Heure de départ réelle de l\'agent'
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
    },
    comment: 'Utilisateur qui a créé la garde'
  },
  validated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Responsable qui a validé la garde'
  },
  date_validation: {
    type: DataTypes.DATE,
    allowNull: true
  },
  heures_supplementaires: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Nombre d\'heures supplémentaires effectuées'
  },
  taux_supplementaire: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 1.5,
    comment: 'Taux de majoration pour les heures supplémentaires'
  },
  notification_envoyee: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Indique si la notification de garde a été envoyée'
  },
  equipement_assigne: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Équipements assignés pour cette garde'
  }
}, {
  tableName: 'gardes',
  indexes: [
    {
      fields: ['agent_id', 'date_debut', 'date_fin']
    },
    {
      fields: ['poste_id', 'date_debut']
    },
    {
      fields: ['statut']
    }
  ]
});

// Associations
Garde.associate = function(models) {
  Garde.belongsTo(models.User, {
    foreignKey: 'agent_id',
    as: 'agent'
  });
  
  Garde.belongsTo(models.User, {
    foreignKey: 'remplacant_id',
    as: 'remplacant'
  });
  
  Garde.belongsTo(models.User, {
    foreignKey: 'created_by',
    as: 'createur'
  });
  
  Garde.belongsTo(models.User, {
    foreignKey: 'validated_by',
    as: 'validateur'
  });
  
  Garde.belongsTo(models.Poste, {
    foreignKey: 'poste_id',
    as: 'poste'
  });
};

// Méthodes d'instance
Garde.prototype.calculerDuree = function() {
  const debut = new Date(`1970-01-01 ${this.heure_debut}`);
  const fin = new Date(`1970-01-01 ${this.heure_fin}`);
  
  if (fin < debut) {
    fin.setDate(fin.getDate() + 1); // Garde qui traverse minuit
  }
  
  return (fin - debut) / (1000 * 60 * 60); // Durée en heures
};

Garde.prototype.estEnCours = function() {
  const maintenant = new Date();
  const debut = new Date(this.date_debut);
  const fin = new Date(this.date_fin);
  
  return maintenant >= debut && maintenant <= fin && this.statut === 'en_cours';
};

Garde.prototype.marquerPresence = function(heureArrivee) {
  this.heure_arrivee_reelle = heureArrivee;
  this.statut = 'en_cours';
  return this.save();
};

Garde.prototype.terminerGarde = function(heureDepart, observations = null) {
  this.heure_depart_reelle = heureDepart;
  this.statut = 'termine';
  if (observations) {
    this.observations = observations;
  }
  
  // Calcul des heures supplémentaires
  const dureePrevu = this.calculerDuree();
  const heureFinPrevue = new Date(`1970-01-01 ${this.heure_fin}`);
  const heureDepartReelle = new Date(`1970-01-01 ${heureDepart}`);
  
  if (heureDepartReelle > heureFinPrevue) {
    this.heures_supplementaires = (heureDepartReelle - heureFinPrevue) / (1000 * 60 * 60);
  }
  
  return this.save();
};

module.exports = Garde;