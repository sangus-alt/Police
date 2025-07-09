const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CarriereMouvement = sequelize.define('CarriereMouvement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'Numéro unique du mouvement de carrière'
  },
  agent_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  type_mouvement: {
    type: DataTypes.ENUM(
      'recrutement', 'promotion', 'affectation', 'mutation', 'detachement',
      'stage', 'formation', 'sanction', 'distinction', 'retraite', 
      'demission', 'licenciement', 'deces', 'disponibilite'
    ),
    allowNull: false
  },
  date_mouvement: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  date_effet: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Date d\'effet du mouvement'
  },
  grade_origine_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'grades',
      key: 'id'
    }
  },
  grade_destination_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'grades',
      key: 'id'
    }
  },
  poste_origine_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'postes',
      key: 'id'
    }
  },
  poste_destination_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'postes',
      key: 'id'
    }
  },
  direction_origine_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'directions',
      key: 'id'
    }
  },
  direction_destination_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'directions',
      key: 'id'
    }
  },
  motif: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Motif détaillé du mouvement'
  },
  decision_autorite: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Référence de la décision de l\'autorité compétente'
  },
  numero_decision: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Numéro de la décision administrative'
  },
  date_decision: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  autorite_signataire: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Autorité ayant signé la décision'
  },
  duree_prevue: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Durée prévue en mois (pour détachements, stages, etc.)'
  },
  date_fin_prevue: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  salaire_avant: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: 'Salaire avant le mouvement'
  },
  salaire_apres: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: 'Salaire après le mouvement'
  },
  indemnites: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Indemnités associées au mouvement'
  },
  conditions_particulieres: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  statut: {
    type: DataTypes.ENUM('en_cours', 'effectif', 'annule', 'suspendu'),
    allowNull: false,
    defaultValue: 'en_cours'
  },
  date_prise_effet: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Date effective de prise d\'effet'
  },
  pieces_jointes: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Documents liés au mouvement'
  },
  observateur_rh_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Agent RH responsable du suivi'
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
  tableName: 'carriere_mouvements',
  hooks: {
    beforeCreate: async (mouvement) => {
      // Génération du numéro unique
      if (!mouvement.numero) {
        const today = new Date();
        const year = today.getFullYear();
        
        const prefixes = {
          'recrutement': 'REC',
          'promotion': 'PROM',
          'affectation': 'AFF',
          'mutation': 'MUT',
          'detachement': 'DET',
          'stage': 'STG',
          'formation': 'FORM',
          'retraite': 'RET'
        };
        
        const prefix = prefixes[mouvement.type_mouvement] || 'MOV';
        
        const count = await CarriereMouvement.count({
          where: {
            type_mouvement: mouvement.type_mouvement,
            created_at: {
              [sequelize.Op.gte]: new Date(year, 0, 1),
              [sequelize.Op.lt]: new Date(year + 1, 0, 1)
            }
          }
        });
        
        mouvement.numero = `${prefix}${year}${(count + 1).toString().padStart(5, '0')}`;
      }
      
      // Calcul de la date de fin prévue si durée prévue fournie
      if (mouvement.duree_prevue && mouvement.date_effet) {
        const dateFin = new Date(mouvement.date_effet);
        dateFin.setMonth(dateFin.getMonth() + mouvement.duree_prevue);
        mouvement.date_fin_prevue = dateFin;
      }
    }
  },
  indexes: [
    {
      fields: ['numero']
    },
    {
      fields: ['agent_id', 'type_mouvement']
    },
    {
      fields: ['date_mouvement']
    },
    {
      fields: ['statut']
    }
  ]
});

// Associations
CarriereMouvement.associate = function(models) {
  CarriereMouvement.belongsTo(models.User, {
    foreignKey: 'agent_id',
    as: 'agent'
  });
  
  CarriereMouvement.belongsTo(models.Grade, {
    foreignKey: 'grade_origine_id',
    as: 'grade_origine'
  });
  
  CarriereMouvement.belongsTo(models.Grade, {
    foreignKey: 'grade_destination_id',
    as: 'grade_destination'
  });
  
  CarriereMouvement.belongsTo(models.Poste, {
    foreignKey: 'poste_origine_id',
    as: 'poste_origine'
  });
  
  CarriereMouvement.belongsTo(models.Poste, {
    foreignKey: 'poste_destination_id',
    as: 'poste_destination'
  });
  
  CarriereMouvement.belongsTo(models.Direction, {
    foreignKey: 'direction_origine_id',
    as: 'direction_origine'
  });
  
  CarriereMouvement.belongsTo(models.Direction, {
    foreignKey: 'direction_destination_id',
    as: 'direction_destination'
  });
  
  CarriereMouvement.belongsTo(models.User, {
    foreignKey: 'observateur_rh_id',
    as: 'observateur_rh'
  });
  
  CarriereMouvement.belongsTo(models.User, {
    foreignKey: 'created_by',
    as: 'createur'
  });
};

// Méthodes d'instance
CarriereMouvement.prototype.effectuer = function() {
  this.statut = 'effectif';
  this.date_prise_effet = new Date();
  return this.save();
};

CarriereMouvement.prototype.annuler = function(motif = null) {
  this.statut = 'annule';
  if (motif) {
    this.observations = (this.observations || '') + `\nAnnulation: ${motif}`;
  }
  return this.save();
};

CarriereMouvement.prototype.estPromotion = function() {
  return this.type_mouvement === 'promotion' && 
         this.grade_destination_id && 
         this.grade_origine_id &&
         this.grade_destination_id !== this.grade_origine_id;
};

CarriereMouvement.prototype.calculerAugmentationSalaire = function() {
  if (!this.salaire_avant || !this.salaire_apres) return null;
  return this.salaire_apres - this.salaire_avant;
};

CarriereMouvement.prototype.calculerPourcentageAugmentation = function() {
  if (!this.salaire_avant || !this.salaire_apres) return null;
  return ((this.salaire_apres - this.salaire_avant) / this.salaire_avant) * 100;
};

// Méthodes de classe
CarriereMouvement.getHistoriqueAgent = function(agentId) {
  return this.findAll({
    where: { agent_id: agentId },
    include: [
      { model: sequelize.models.Grade, as: 'grade_origine', attributes: ['nom'] },
      { model: sequelize.models.Grade, as: 'grade_destination', attributes: ['nom'] },
      { model: sequelize.models.Poste, as: 'poste_origine', attributes: ['nom'] },
      { model: sequelize.models.Poste, as: 'poste_destination', attributes: ['nom'] }
    ],
    order: [['date_mouvement', 'DESC']]
  });
};

CarriereMouvement.getPromotionsEnCours = function() {
  return this.findAll({
    where: {
      type_mouvement: 'promotion',
      statut: 'en_cours'
    },
    include: [
      { model: sequelize.models.User, as: 'agent', attributes: ['nom', 'prenoms', 'matricule_police'] },
      { model: sequelize.models.Grade, as: 'grade_origine', attributes: ['nom'] },
      { model: sequelize.models.Grade, as: 'grade_destination', attributes: ['nom'] }
    ],
    order: [['date_effet', 'ASC']]
  });
};

CarriereMouvement.getMutationsEnCours = function() {
  return this.findAll({
    where: {
      type_mouvement: 'mutation',
      statut: 'en_cours'
    },
    include: [
      { model: sequelize.models.User, as: 'agent', attributes: ['nom', 'prenoms', 'matricule_police'] },
      { model: sequelize.models.Poste, as: 'poste_origine', attributes: ['nom'] },
      { model: sequelize.models.Poste, as: 'poste_destination', attributes: ['nom'] }
    ],
    order: [['date_effet', 'ASC']]
  });
};

CarriereMouvement.getRetraitesPrevues = function(annee = null) {
  const year = annee || new Date().getFullYear();
  
  return this.findAll({
    where: {
      type_mouvement: 'retraite',
      date_effet: {
        [sequelize.Op.gte]: new Date(year, 0, 1),
        [sequelize.Op.lt]: new Date(year + 1, 0, 1)
      }
    },
    include: [
      { model: sequelize.models.User, as: 'agent', attributes: ['nom', 'prenoms', 'matricule_police', 'date_naissance'] },
      { model: sequelize.models.Grade, as: 'grade_origine', attributes: ['nom'] }
    ],
    order: [['date_effet', 'ASC']]
  });
};

module.exports = CarriereMouvement;