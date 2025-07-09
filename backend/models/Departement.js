const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Departement = sequelize.define('Departement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  region_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'regions',
      key: 'id'
    }
  },
  chef_lieu: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  population: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  superficie: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Superficie en km²'
  },
  coordonnees_centre: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Coordonnées géographiques du centre du département'
  },
  statut: {
    type: DataTypes.ENUM('actif', 'inactif'),
    allowNull: false,
    defaultValue: 'actif'
  }
}, {
  tableName: 'departements'
});

// Associations
Departement.associate = function(models) {
  Departement.belongsTo(models.Region, {
    foreignKey: 'region_id',
    as: 'region'
  });
  
  Departement.hasMany(models.Commune, {
    foreignKey: 'departement_id',
    as: 'communes'
  });
  
  Departement.hasMany(models.Poste, {
    foreignKey: 'departement_id',
    as: 'postes'
  });
};

module.exports = Departement;