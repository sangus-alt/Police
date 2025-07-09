const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RegistreAgent = sequelize.define('RegistreAgent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_registre: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'Numéro unique du registre'
  },
  type_registre: {
    type: DataTypes.ENUM(
      'effectifs_generaux', 'retraites', 'conges', 'permissions', 
      'stages', 'detachements', 'deces', 'sanctions', 'distinctions',
      'formations', 'mutations', 'promotions'
    ),
    allowNull: false
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
    allowNull: true,
    references: {
      model: 'postes',
      key: 'id'
    },
    comment: 'Poste d\'affectation concerné'
  },
  region_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'regions',
      key: 'id'
    }
  },
  departement_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'departements',
      key: 'id'
    }
  },
  commune_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'communes',
      key: 'id'
    }
  },
  direction_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'directions',
      key: 'id'
    }
  },
  date_evenement: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Date de l\'événement enregistré'
  },
  date_effet: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Date d\'effet si différente de la date d\'événement'
  },
  titre: {
    type: DataTypes.STRING(200),
    allowNull: false,
    comment: 'Titre de l\'entrée du registre'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Description détaillée de l\'événement'
  },
  motif: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Motif ou raison de l\'événement'
  },
  reference_decision: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Référence de la décision administrative'
  },
  autorite_signataire: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Autorité ayant signé la décision'
  },
  duree: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Durée en jours (pour congés, stages, etc.)'
  },
  date_debut: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Date de début (pour événements avec durée)'
  },
  date_fin: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Date de fin (pour événements avec durée)'
  },
  lieu: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Lieu de l\'événement (formation, stage, etc.)'
  },
  grade_avant: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Grade avant l\'événement (pour promotions)'
  },
  grade_apres: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Grade après l\'événement (pour promotions)'
  },
  poste_avant: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Poste avant l\'événement (pour mutations)'
  },
  poste_apres: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Poste après l\'événement (pour mutations)'
  },
  statut_avant: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Statut avant l\'événement'
  },
  statut_apres: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Statut après l\'événement'
  },
  remplacant: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Nom du remplaçant (pour congés, détachements)'
  },
  contact_urgence: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Contact d\'urgence pendant l\'absence'
  },
  cause_deces: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Cause du décès si applicable'
  },
  lieu_deces: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Lieu du décès si applicable'
  },
  type_distinction: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Type de distinction reçue'
  },
  type_sanction: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Type de sanction appliquée'
  },
  gravite_sanction: {
    type: DataTypes.ENUM('avertissement', 'blame', 'exclusion_temporaire', 'retrogradation', 'revocation'),
    allowNull: true
  },
  organisme_formation: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Organisme de formation'
  },
  diplome_obtenu: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Diplôme ou certification obtenu'
  },
  pieces_jointes: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Documents joints à l\'entrée du registre'
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  visible_public: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Visible dans les registres publics'
  },
  archivage_automatique: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  date_archivage: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  validated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  date_validation: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'registres_agents',
  hooks: {
    beforeCreate: async (registre) => {
      // Génération du numéro de registre
      if (!registre.numero_registre) {
        const today = new Date();
        const year = today.getFullYear();
        
        const prefixes = {
          'effectifs_generaux': 'EFF',
          'retraites': 'RET',
          'conges': 'CG',
          'permissions': 'PER',
          'stages': 'STG',
          'detachements': 'DET',
          'deces': 'DEC',
          'sanctions': 'SAN',
          'distinctions': 'DIS',
          'formations': 'FOR',
          'mutations': 'MUT',
          'promotions': 'PRO'
        };
        
        const prefix = prefixes[registre.type_registre] || 'REG';
        
        const count = await RegistreAgent.count({
          where: {
            type_registre: registre.type_registre,
            created_at: {
              [sequelize.Op.gte]: new Date(year, 0, 1),
              [sequelize.Op.lt]: new Date(year + 1, 0, 1)
            }
          }
        });
        
        registre.numero_registre = `${prefix}${year}${(count + 1).toString().padStart(6, '0')}`;
      }
    }
  },
  indexes: [
    {
      fields: ['numero_registre']
    },
    {
      fields: ['type_registre', 'agent_id']
    },
    {
      fields: ['poste_id', 'date_evenement']
    },
    {
      fields: ['region_id', 'type_registre']
    },
    {
      fields: ['date_evenement']
    },
    {
      fields: ['visible_public']
    }
  ]
});

// Associations
RegistreAgent.associate = function(models) {
  RegistreAgent.belongsTo(models.User, {
    foreignKey: 'agent_id',
    as: 'agent'
  });
  
  RegistreAgent.belongsTo(models.Poste, {
    foreignKey: 'poste_id',
    as: 'poste'
  });
  
  RegistreAgent.belongsTo(models.Region, {
    foreignKey: 'region_id',
    as: 'region'
  });
  
  RegistreAgent.belongsTo(models.Departement, {
    foreignKey: 'departement_id',
    as: 'departement'
  });
  
  RegistreAgent.belongsTo(models.Commune, {
    foreignKey: 'commune_id',
    as: 'commune'
  });
  
  RegistreAgent.belongsTo(models.Direction, {
    foreignKey: 'direction_id',
    as: 'direction'
  });
  
  RegistreAgent.belongsTo(models.User, {
    foreignKey: 'created_by',
    as: 'createur'
  });
  
  RegistreAgent.belongsTo(models.User, {
    foreignKey: 'validated_by',
    as: 'validateur'
  });
};

// Méthodes d'instance
RegistreAgent.prototype.valider = function(validateurId) {
  this.validated_by = validateurId;
  this.date_validation = new Date();
  return this.save();
};

RegistreAgent.prototype.archiver = function() {
  this.date_archivage = new Date();
  return this.save();
};

RegistreAgent.prototype.genererFicheRegistre = function() {
  return {
    numero: this.numero_registre,
    type: this.type_registre,
    agent: this.agent ? `${this.agent.grade?.nom || ''} ${this.agent.nom} ${this.agent.prenoms}` : '',
    matricule: this.agent?.matricule_police || '',
    date: this.date_evenement,
    titre: this.titre,
    description: this.description,
    poste: this.poste?.nom || '',
    region: this.region?.nom || ''
  };
};

// Méthodes de classe
RegistreAgent.getRegistreParType = function(typeRegistre, filtres = {}) {
  const where = { type_registre: typeRegistre };
  
  if (filtres.poste_id) where.poste_id = filtres.poste_id;
  if (filtres.region_id) where.region_id = filtres.region_id;
  if (filtres.departement_id) where.departement_id = filtres.departement_id;
  if (filtres.commune_id) where.commune_id = filtres.commune_id;
  if (filtres.direction_id) where.direction_id = filtres.direction_id;
  
  if (filtres.date_debut && filtres.date_fin) {
    where.date_evenement = {
      [sequelize.Op.between]: [filtres.date_debut, filtres.date_fin]
    };
  }
  
  return this.findAll({
    where,
    include: [
      { model: sequelize.models.User, as: 'agent', attributes: ['nom', 'prenoms', 'matricule_police'] },
      { model: sequelize.models.Poste, as: 'poste', attributes: ['nom'] },
      { model: sequelize.models.Region, as: 'region', attributes: ['nom'] }
    ],
    order: [['date_evenement', 'DESC']]
  });
};

RegistreAgent.getRegistreEffectifs = function(filtres = {}) {
  return this.getRegistreParType('effectifs_generaux', filtres);
};

RegistreAgent.getRegistreRetraites = function(filtres = {}) {
  return this.getRegistreParType('retraites', filtres);
};

RegistreAgent.getRegistreConges = function(filtres = {}) {
  return this.getRegistreParType('conges', filtres);
};

RegistreAgent.getRegistrePermissions = function(filtres = {}) {
  return this.getRegistreParType('permissions', filtres);
};

RegistreAgent.getRegistreStages = function(filtres = {}) {
  return this.getRegistreParType('stages', filtres);
};

RegistreAgent.getRegistreDetachements = function(filtres = {}) {
  return this.getRegistreParType('detachements', filtres);
};

RegistreAgent.getRegistreDeces = function(filtres = {}) {
  return this.getRegistreParType('deces', filtres);
};

RegistreAgent.getRegistreSanctions = function(filtres = {}) {
  return this.getRegistreParType('sanctions', filtres);
};

RegistreAgent.getRegistreDistinctions = function(filtres = {}) {
  return this.getRegistreParType('distinctions', filtres);
};

RegistreAgent.getStatistiquesParType = function(annee = null) {
  const year = annee || new Date().getFullYear();
  
  return this.findAll({
    attributes: [
      'type_registre',
      [sequelize.fn('COUNT', sequelize.col('id')), 'total']
    ],
    where: {
      date_evenement: {
        [sequelize.Op.gte]: new Date(year, 0, 1),
        [sequelize.Op.lt]: new Date(year + 1, 0, 1)
      }
    },
    group: ['type_registre'],
    order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
  });
};

RegistreAgent.exporterRegistre = function(typeRegistre, filtres = {}, format = 'pdf') {
  // Cette méthode sera implémentée pour exporter les registres
  return {
    success: true,
    message: `Export du registre ${typeRegistre} en format ${format}`,
    filename: `registre_${typeRegistre}_${new Date().toISOString().split('T')[0]}.${format}`
  };
};

module.exports = RegistreAgent;