const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Poste = sequelize.define('Poste', {
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
      notEmpty: true,
      len: [3, 150]
    }
  },
  code: {
    type: DataTypes.STRING(10),
    allowNull: true,
    unique: true,
    comment: 'Code du poste (ex: LBV01, PG01, etc.)'
  },
  type: {
    type: DataTypes.ENUM('commissariat', 'brigade', 'poste', 'sous_prefecture'),
    allowNull: false,
    defaultValue: 'poste'
  },
  ville: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  province: {
    type: DataTypes.ENUM(
      'Estuaire', 'Haut-Ogooué', 'Moyen-Ogooué', 'Ngounié', 
      'Nyanga', 'Ogooué-Ivindo', 'Ogooué-Lolo', 'Ogooué-Maritime', 'Woleu-Ntem'
    ),
    allowNull: false
  },
  adresse: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  telephone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: /^\+241-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}$/
    }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
    validate: {
      min: -90,
      max: 90
    }
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
    validate: {
      min: -180,
      max: 180
    }
  },
  statut: {
    type: DataTypes.ENUM('actif', 'inactif', 'en_construction', 'ferme'),
    allowNull: false,
    defaultValue: 'actif'
  },
  responsable_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'ID du responsable du poste (Commissaire, Commandant, etc.)'
  },
  effectif_total: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Nombre total d\'agents affectés au poste'
  },
  horaires_ouverture: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Horaires d\'ouverture par jour de la semaine'
  },
  equipements: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Liste des équipements disponibles'
  },
  zone_competence: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Description de la zone de compétence territoriale'
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
  tableName: 'postes',
  hooks: {
    beforeCreate: async (poste) => {
      // Génération automatique du code si non fourni
      if (!poste.code) {
        const initiales = poste.ville.substring(0, 3).toUpperCase();
        const count = await Poste.count({ where: { ville: poste.ville } });
        poste.code = `${initiales}${(count + 1).toString().padStart(2, '0')}`;
      }
    }
  }
});

// Associations
Poste.associate = function(models) {
  Poste.belongsTo(models.User, {
    foreignKey: 'responsable_id',
    as: 'responsable'
  });
  
  Poste.hasMany(models.User, {
    foreignKey: 'poste_id',
    as: 'agents'
  });
  
  Poste.hasMany(models.Garde, {
    foreignKey: 'poste_id',
    as: 'gardes'
  });
  
  Poste.hasMany(models.Intervention, {
    foreignKey: 'poste_id',
    as: 'interventions'
  });
  
  Poste.hasMany(models.Visite, {
    foreignKey: 'poste_id',
    as: 'visites'
  });
  
  Poste.hasMany(models.RendezVous, {
    foreignKey: 'poste_id',
    as: 'rendez_vous'
  });
  
  Poste.hasMany(models.Verbalisation, {
    foreignKey: 'poste_id',
    as: 'verbalisations'
  });
  
  Poste.hasMany(models.ObjetPerdu, {
    foreignKey: 'poste_id',
    as: 'objets_perdus'
  });
};

// Méthodes d'instance
Poste.prototype.getCoordinates = function() {
  return {
    latitude: parseFloat(this.latitude),
    longitude: parseFloat(this.longitude)
  };
};

Poste.prototype.calculerDistance = function(latitude, longitude) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (latitude - this.latitude) * Math.PI / 180;
  const dLon = (longitude - this.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.latitude * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance en km
};

module.exports = Poste;