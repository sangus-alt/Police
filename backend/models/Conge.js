const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Conge = sequelize.define('Conge', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'Numéro unique de la demande de congé'
  },
  agent_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  type_conge: {
    type: DataTypes.ENUM(
      'conge_annuel', 'conge_maladie', 'conge_maternite', 'conge_paternite',
      'conge_formation', 'conge_exceptionnel', 'conge_sans_solde', 
      'permission_absence', 'recuperation'
    ),
    allowNull: false
  },
  motif: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [5, 500]
    }
  },
  date_debut: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  date_fin: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  nombre_jours: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  date_retour_prevue: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  date_retour_effective: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  statut: {
    type: DataTypes.ENUM(
      'en_attente', 'valide', 'refuse', 'en_cours', 'termine', 
      'annule', 'reporte', 'prolonge'
    ),
    allowNull: false,
    defaultValue: 'en_attente'
  },
  demandeur_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Qui a fait la demande (peut être différent de l\'agent concerné)'
  },
  validateur_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Responsable qui a validé ou refusé'
  },
  date_validation: {
    type: DataTypes.DATE,
    allowNull: true
  },
  commentaire_validation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  remplacant_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Agent désigné pour le remplacement'
  },
  adresse_conge: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Adresse où joindre l\'agent pendant le congé'
  },
  telephone_conge: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Téléphone de contact pendant le congé'
  },
  certificat_medical: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Chemin vers le certificat médical si nécessaire'
  },
  documents_justificatifs: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Documents joints à la demande'
  },
  solde_avant: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Solde de congés avant cette demande'
  },
  solde_apres: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Solde de congés après cette demande'
  },
  avec_solde: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Congé avec ou sans solde'
  },
  urgence: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Demande urgente nécessitant traitement prioritaire'
  },
  annee_exercice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Année d\'exercice pour le calcul des droits'
  },
  jours_ouvres: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Nombre de jours ouvrés effectifs'
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'conges',
  hooks: {
    beforeCreate: async (conge) => {
      // Génération du numéro unique
      if (!conge.numero) {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        
        const count = await Conge.count({
          where: {
            created_at: {
              [sequelize.Op.gte]: new Date(year, today.getMonth(), 1),
              [sequelize.Op.lt]: new Date(year, today.getMonth() + 1, 1)
            }
          }
        });
        
        conge.numero = `CG${year}${month}${(count + 1).toString().padStart(4, '0')}`;
      }
      
      // Calcul automatique du nombre de jours
      if (conge.date_debut && conge.date_fin) {
        const debut = new Date(conge.date_debut);
        const fin = new Date(conge.date_fin);
        const diffTime = fin - debut;
        conge.nombre_jours = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        // Calcul des jours ouvrés (exclut weekends)
        let joursOuvres = 0;
        for (let d = new Date(debut); d <= fin; d.setDate(d.getDate() + 1)) {
          if (d.getDay() !== 0 && d.getDay() !== 6) { // Pas dimanche ni samedi
            joursOuvres++;
          }
        }
        conge.jours_ouvres = joursOuvres;
      }
      
      // Année d'exercice
      if (!conge.annee_exercice) {
        conge.annee_exercice = new Date().getFullYear();
      }
    }
  },
  indexes: [
    {
      fields: ['numero']
    },
    {
      fields: ['agent_id', 'statut']
    },
    {
      fields: ['type_conge']
    },
    {
      fields: ['date_debut', 'date_fin']
    },
    {
      fields: ['annee_exercice']
    }
  ]
});

// Associations
Conge.associate = function(models) {
  Conge.belongsTo(models.User, {
    foreignKey: 'agent_id',
    as: 'agent'
  });
  
  Conge.belongsTo(models.User, {
    foreignKey: 'demandeur_id',
    as: 'demandeur'
  });
  
  Conge.belongsTo(models.User, {
    foreignKey: 'validateur_id',
    as: 'validateur'
  });
  
  Conge.belongsTo(models.User, {
    foreignKey: 'remplacant_id',
    as: 'remplacant'
  });
};

// Méthodes d'instance
Conge.prototype.valider = function(validateurId, commentaire = null) {
  this.statut = 'valide';
  this.validateur_id = validateurId;
  this.date_validation = new Date();
  if (commentaire) {
    this.commentaire_validation = commentaire;
  }
  return this.save();
};

Conge.prototype.refuser = function(validateurId, motif) {
  this.statut = 'refuse';
  this.validateur_id = validateurId;
  this.date_validation = new Date();
  this.commentaire_validation = motif;
  return this.save();
};

Conge.prototype.commencer = function() {
  this.statut = 'en_cours';
  return this.save();
};

Conge.prototype.terminer = function(dateRetourEffective = null) {
  this.statut = 'termine';
  this.date_retour_effective = dateRetourEffective || new Date();
  return this.save();
};

Conge.prototype.estEnCours = function() {
  const today = new Date();
  const debut = new Date(this.date_debut);
  const fin = new Date(this.date_fin);
  
  return this.statut === 'valide' && today >= debut && today <= fin;
};

Conge.prototype.joursRestants = function() {
  if (this.statut !== 'en_cours') return 0;
  
  const today = new Date();
  const fin = new Date(this.date_fin);
  
  if (today > fin) return 0;
  
  const diffTime = fin - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Méthodes de classe
Conge.findEnCours = function(agentId = null) {
  const where = {
    statut: 'en_cours',
    date_debut: { [sequelize.Op.lte]: new Date() },
    date_fin: { [sequelize.Op.gte]: new Date() }
  };
  
  if (agentId) {
    where.agent_id = agentId;
  }
  
  return this.findAll({
    where,
    include: [
      { model: sequelize.models.User, as: 'agent', attributes: ['nom', 'prenoms', 'matricule_police'] }
    ]
  });
};

Conge.findEnAttente = function(posteId = null) {
  const include = [
    { model: sequelize.models.User, as: 'agent', attributes: ['nom', 'prenoms', 'matricule_police'] }
  ];
  
  if (posteId) {
    include[0].where = { poste_id: posteId };
  }
  
  return this.findAll({
    where: { statut: 'en_attente' },
    include,
    order: [['urgence', 'DESC'], ['created_at', 'ASC']]
  });
};

module.exports = Conge;