const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize'); // Added Op import

const Grade = sequelize.define('Grade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: true,
    unique: true,
    comment: 'Code abrégé du grade (ex: COM, CAP, LT, etc.)'
  },
  niveau: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 20
    },
    comment: 'Niveau hiérarchique du grade (0 = plus bas, 20 = plus haut)'
  },
  categorie: {
    type: DataTypes.ENUM('officier_superieur', 'officier', 'sous_officier', 'agent'),
    allowNull: false,
    defaultValue: 'agent'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  salaire_base: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: 'Salaire de base en FCFA'
  },
  indemnites: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Liste des indemnités associées au grade'
  },
  conditions_promotion: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Conditions requises pour accéder à ce grade'
  },
  duree_minimum: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Durée minimum dans le grade précédent (en mois)'
  },
  formation_requise: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Formations requises pour ce grade'
  },
  privileges: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Privilèges et autorisations spéciales'
  },
  statut: {
    type: DataTypes.ENUM('actif', 'inactif', 'archive'),
    allowNull: false,
    defaultValue: 'actif'
  },
  date_creation: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'grades',
  hooks: {
    beforeCreate: async (grade) => {
      // Génération automatique du code si non fourni
      if (!grade.code) {
        const mots = grade.nom.split(' ');
        grade.code = mots.map(mot => mot.substring(0, 2).toUpperCase()).join('');
      }
    }
  }
});

// Associations
Grade.associate = function(models) {
  Grade.hasMany(models.User, {
    foreignKey: 'grade_id',
    as: 'agents'
  });
  
  Grade.hasMany(models.Promotion, {
    foreignKey: 'grade_origine_id',
    as: 'promotions_depuis'
  });
  
  Grade.hasMany(models.Promotion, {
    foreignKey: 'grade_destination_id',
    as: 'promotions_vers'
  });
};

// Méthodes de classe
Grade.findByNiveau = function(niveau) {
  return this.findAll({
    where: { niveau },
    order: [['nom', 'ASC']]
  });
};

Grade.findByCategorie = function(categorie) {
  return this.findAll({
    where: { categorie },
    order: [['niveau', 'DESC']]
  });
};

Grade.getHierarchie = function() {
  return this.findAll({
    order: [['niveau', 'DESC']]
  });
};

// Méthodes d'instance
Grade.prototype.peutPromovoir = function(gradeDestination) {
  return gradeDestination.niveau > this.niveau;
};

Grade.prototype.getGradesSuperieurs = function() {
  return Grade.findAll({
    where: {
      niveau: {
        [Op.gt]: this.niveau
      }
    },
    order: [['niveau', 'ASC']]
  });
};

Grade.prototype.getGradesInferieurs = function() {
  return Grade.findAll({
    where: {
      niveau: {
        [Op.lt]: this.niveau
      }
    },
    order: [['niveau', 'DESC']]
  });
};

module.exports = Grade;