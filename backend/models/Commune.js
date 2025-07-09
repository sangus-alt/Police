const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Commune = sequelize.define('Commune', {
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
  departement_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'departements',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('commune_urbaine', 'commune_rurale', 'arrondissement'),
    allowNull: false,
    defaultValue: 'commune_urbaine'
  },
  maire: {
    type: DataTypes.STRING(200),
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
    comment: 'Coordonnées géographiques du centre de la commune'
  },
  statut: {
    type: DataTypes.ENUM('actif', 'inactif'),
    allowNull: false,
    defaultValue: 'actif'
  },
  date_creation: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'communes'
});

// Associations
Commune.associate = function(models) {
  Commune.belongsTo(models.Departement, {
    foreignKey: 'departement_id',
    as: 'departement'
  });
  
  Commune.hasMany(models.Poste, {
    foreignKey: 'commune_id',
    as: 'postes'
  });
  
  Commune.hasMany(models.User, {
    foreignKey: 'commune_affectation_id',
    as: 'agents_affectes'
  });
};

module.exports = Commune;