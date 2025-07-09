const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  matricule_police: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'Matricule police unique'
  },
  matricule_solde: {
    type: DataTypes.STRING(20),
    allowNull: true,
    unique: true,
    comment: 'Matricule de solde (paie)'
  },
  matricule_systeme: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'ID unique du système généré automatiquement'
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
    type: DataTypes.ENUM(
      'actif', 'inactif', 'suspendu', 'retraite', 'conge', 'permission', 
      'stage', 'detachement', 'maladie', 'disponibilite', 'decede'
    ),
    allowNull: false,
    defaultValue: 'actif'
  },
  date_naissance: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Date de naissance pour calcul automatique de l\'âge'
  },
  lieu_naissance: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  sexe: {
    type: DataTypes.ENUM('M', 'F'),
    allowNull: false
  },
  situation_matrimoniale: {
    type: DataTypes.ENUM('celibataire', 'marie', 'divorce', 'veuf'),
    allowNull: false,
    defaultValue: 'celibataire'
  },
  nombre_enfants: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
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
    comment: 'Chemin vers la photo de profil de l\'agent'
  },
  date_prise_service: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Date de prise de service pour calcul ancienneté'
  },
  date_entree_service: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Date d\'entrée dans la police'
  },
  date_fin_service: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    comment: 'Date de fin de service (retraite, démission, etc.)'
  },
  specialites: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Liste des spécialités et compétences'
  },
  formations: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Historique des formations suivies'
  },
  distinctions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Médailles, décorations, mentions'
  },
  sanctions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Historique des sanctions disciplinaires'
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
  age_retraite: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Âge de départ à la retraite selon le grade'
  },
  solde_conges: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30,
    comment: 'Solde de congés annuels en jours'
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
      
      // Génération automatique des matricules si non fournis
      if (!user.matricule_police) {
        const count = await User.count();
        user.matricule_police = `POL${(count + 1).toString().padStart(6, '0')}`;
      }
      
      if (!user.matricule_systeme) {
        const year = new Date().getFullYear();
        const count = await User.count();
        user.matricule_systeme = `SYS${year}${(count + 1).toString().padStart(6, '0')}`;
      }
      
      // Calcul de l'âge de retraite selon le grade
      if (user.grade_id) {
        user.age_retraite = await calculateRetirementAge(user.grade_id);
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

// Fonction pour calculer l'âge de retraite selon le grade
async function calculateRetirementAge(gradeId) {
  const Grade = require('./Grade');
  const grade = await Grade.findByPk(gradeId);
  
  if (!grade) return 60; // Âge par défaut
  
  // Logique selon la hiérarchie
  if (grade.niveau >= 8) return 65; // Commissaires et plus: 61-65 ans
  if (grade.niveau >= 5) return 60; // Officiers: 55-60 ans  
  if (grade.niveau >= 2) return 55; // Sous-officiers: 50-55 ans
  return 50; // Agents: 50 ans
}

// Méthodes d'instance
User.prototype.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

User.prototype.calculerAge = function() {
  if (!this.date_naissance) return null;
  const today = new Date();
  const birthDate = new Date(this.date_naissance);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

User.prototype.calculerAnneeService = function() {
  if (!this.date_prise_service) return 0;
  const today = new Date();
  const serviceDate = new Date(this.date_prise_service);
  let years = today.getFullYear() - serviceDate.getFullYear();
  const monthDiff = today.getMonth() - serviceDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < serviceDate.getDate())) {
    years--;
  }
  
  return Math.max(0, years);
};

User.prototype.peutPartirRetraite = function() {
  const age = this.calculerAge();
  const anneesService = this.calculerAnneeService();
  
  return age >= (this.age_retraite || 60) || anneesService >= 30;
};

User.prototype.joursAvantRetraite = function() {
  if (!this.date_naissance) return null;
  
  const dateRetraite = new Date(this.date_naissance);
  dateRetraite.setFullYear(dateRetraite.getFullYear() + (this.age_retraite || 60));
  
  const today = new Date();
  const diffTime = dateRetraite - today;
  
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  delete values.reset_password_token;
  delete values.reset_password_expires;
  
  // Ajout des calculs automatiques
  values.age = this.calculerAge();
  values.annees_service = this.calculerAnneeService();
  values.peut_partir_retraite = this.peutPartirRetraite();
  values.jours_avant_retraite = this.joursAvantRetraite();
  
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
  
  User.belongsTo(models.Direction, {
    foreignKey: 'direction_id',
    as: 'direction'
  });
  
  User.belongsTo(models.Commune, {
    foreignKey: 'commune_affectation_id',
    as: 'commune_affectation'
  });
  
  User.hasMany(models.Conge, {
    foreignKey: 'agent_id',
    as: 'conges'
  });
  
  User.hasMany(models.CarriereMouvement, {
    foreignKey: 'agent_id',
    as: 'mouvements_carriere'
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