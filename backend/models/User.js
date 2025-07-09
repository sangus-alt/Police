const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  matricule: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
    comment: 'Matricule unique de l\'agent'
  },
  nom: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  prenoms: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  telephone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: /^\+241-[0-9]{2}-[0-9]{2}-[0-9]{2}-[0-9]{2}$/
    }
  },
  role: {
    type: DataTypes.ENUM('admin', 'secretaire', 'enqueteur', 'agent_permanence', 'agent_rh', 'commissaire', 'commandant'),
    allowNull: false,
    defaultValue: 'agent_permanence'
  },
  statut: {
    type: DataTypes.ENUM('actif', 'inactif', 'suspendu', 'retraite'),
    allowNull: false,
    defaultValue: 'actif'
  },
  date_naissance: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  lieu_naissance: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  cni: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true,
    comment: 'Numéro de Carte Nationale d\'Identité'
  },
  adresse: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  photo: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Chemin vers la photo de profil'
  },
  date_entree_service: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  specialites: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Liste des spécialités et compétences'
  },
  derniere_connexion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  niveau_habilitation: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Niveau d\'habilitation pour accéder aux différents modules'
  },
  reset_password_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  reset_password_expires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
        user.password = await bcrypt.hash(user.password, salt);
      }
      // Génération automatique du matricule si non fourni
      if (!user.matricule) {
        const count = await User.count();
        user.matricule = `POL${(count + 1).toString().padStart(6, '0')}`;
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Méthodes d'instance
User.prototype.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  delete values.reset_password_token;
  delete values.reset_password_expires;
  return values;
};

// Associations
User.associate = function(models) {
  User.belongsTo(models.Poste, {
    foreignKey: 'poste_id',
    as: 'poste'
  });
  
  User.belongsTo(models.Grade, {
    foreignKey: 'grade_id',
    as: 'grade'
  });
  
  User.hasMany(models.Message, {
    foreignKey: 'expediteur_id',
    as: 'messages_envoyes'
  });
  
  User.hasMany(models.Notification, {
    foreignKey: 'destinataire_id',
    as: 'notifications'
  });
  
  User.hasMany(models.Garde, {
    foreignKey: 'agent_id',
    as: 'gardes'
  });
  
  User.hasMany(models.Intervention, {
    foreignKey: 'responsable_id',
    as: 'interventions_responsable'
  });
  
  User.hasMany(models.Rapport, {
    foreignKey: 'redacteur_id',
    as: 'rapports'
  });
  
  User.hasMany(models.Verbalisation, {
    foreignKey: 'agent_id',
    as: 'verbalisations'
  });
  
  User.hasMany(models.FicheRenseignement, {
    foreignKey: 'agent_id',
    as: 'fiches_renseignement'
  });
};

module.exports = User;