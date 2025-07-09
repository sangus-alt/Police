const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Region = sequelize.define('Region', {
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
      notEmpty: true
    }
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
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
    comment: 'Coordonnées géographiques du centre de la région'
  },
  statut: {
    type: DataTypes.ENUM('actif', 'inactif'),
    allowNull: false,
    defaultValue: 'actif'
  }
}, {
  tableName: 'regions'
});

// Associations
Region.associate = function(models) {
  Region.hasMany(models.Departement, {
    foreignKey: 'region_id',
    as: 'departements'
  });
  
  Region.hasMany(models.Poste, {
    foreignKey: 'region_id',
    as: 'postes'
  });
};

module.exports = Region;