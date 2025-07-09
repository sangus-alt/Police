const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Direction = sequelize.define('Direction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.ENUM(
      'voie_publique', 'enquetes', 'renseignement', 'administrative', 
      'formation', 'logistique', 'informatique', 'communication'
    ),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  directeur_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Directeur responsable de la direction'
  },
  directeur_adjoint_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Directeur adjoint'
  },
  effectif_total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  budget_annuel: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: 'Budget annuel alloué en FCFA'
  },
  missions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Missions principales de la direction'
  },
  competences_requises: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Compétences requises pour travailler dans cette direction'
  },
  localisation: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Adresse physique de la direction'
  },
  telephone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  niveau_acces: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Niveau d\'accès sécuritaire requis (1-5)'
  },
  statut: {
    type: DataTypes.ENUM('actif', 'inactif', 'restructuration'),
    allowNull: false,
    defaultValue: 'actif'
  },
  date_creation: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'directions'
});

// Associations
Direction.associate = function(models) {
  Direction.belongsTo(models.User, {
    foreignKey: 'directeur_id',
    as: 'directeur'
  });
  
  Direction.belongsTo(models.User, {
    foreignKey: 'directeur_adjoint_id',
    as: 'directeur_adjoint'
  });
  
  Direction.hasMany(models.User, {
    foreignKey: 'direction_id',
    as: 'agents'
  });
  
  Direction.hasMany(models.Service, {
    foreignKey: 'direction_id',
    as: 'services'
  });
};

// Méthodes d'instance
Direction.prototype.getEffectifReel = async function() {
  const User = require('./User');
  return await User.count({
    where: {
      direction_id: this.id,
      statut: 'actif'
    }
  });
};

Direction.prototype.getTauxOccupation = async function() {
  const effectifReel = await this.getEffectifReel();
  return this.effectif_total > 0 ? (effectifReel / this.effectif_total) * 100 : 0;
};

module.exports = Direction;