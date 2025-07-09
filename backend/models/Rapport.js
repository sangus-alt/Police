const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

const Rapport = sequelize.define('Rapport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
    comment: 'Numéro unique du rapport (ex: PV2024010001)'
  },
  type: {
    type: DataTypes.ENUM(
      'proces_verbal', 'rapport_intervention', 'rapport_enquete', 'constat', 
      'attestation', 'convocation', 'plainte', 'temoignage', 'autre'
    ),
    allowNull: false
  },
  titre: {
    type: DataTypes.STRING(300),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [5, 300]
    }
  },
  contenu: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [20, 50000]
    }
  },
  resume: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Résumé du rapport pour affichage rapide'
  },
  redacteur_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  intervention_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'interventions',
      key: 'id'
    },
    comment: 'Intervention liée au rapport'
  },
  poste_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'postes',
      key: 'id'
    }
  },
  date_faits: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Date et heure des faits rapportés'
  },
  lieu_faits: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Lieu détaillé des faits'
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  personnes_impliquees: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Liste des personnes impliquées (victimes, témoins, suspects)'
  },
  vehicules_impliques: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Véhicules impliqués dans les faits'
  },
  infractions: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Codes et descriptions des infractions constatées'
  },
  articles_loi: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Articles de loi et références juridiques applicables'
  },
  pieces_conviction: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Pièces à conviction saisies'
  },
  temoins: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Dépositions des témoins'
  },
  mesures_prises: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Mesures immédiates prises sur les lieux'
  },
  suites_donnees: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Suites données à l\'affaire'
  },
  statut: {
    type: DataTypes.ENUM('brouillon', 'redige', 'valide', 'transmis', 'clos', 'archive'),
    allowNull: false,
    defaultValue: 'brouillon'
  },
  validation: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Historique des validations (validateur, date, commentaires)'
  },
  transmission: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Informations de transmission (destinataire, date, accusé réception)'
  },
  classification: {
    type: DataTypes.ENUM('public', 'interne', 'confidentiel', 'secret_defense'),
    allowNull: false,
    defaultValue: 'interne'
  },
  priorite: {
    type: DataTypes.ENUM('normale', 'haute', 'urgente'),
    allowNull: false,
    defaultValue: 'normale'
  },
  pieces_jointes: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Photos, documents, plans joints au rapport'
  },
  signature_numerique: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Signature numérique du rapport'
  },
  references_externes: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Références vers d\'autres dossiers, rapports, procédures'
  },
  delai_conservation: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Délai de conservation en années'
  },
  mots_cles: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Mots-clés pour faciliter la recherche'
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Version du rapport pour suivi des modifications'
  },
  rapport_parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'rapports',
      key: 'id'
    },
    comment: 'Rapport parent en cas de modification ou complément'
  },
  date_cloture: {
    type: DataTypes.DATE,
    allowNull: true
  },
  archivage_automatique: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'rapports',
  hooks: {
    beforeCreate: async (rapport) => {
      if (!rapport.numero) {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        
        let prefix = 'RPT';
        switch (rapport.type) {
          case 'proces_verbal':
            prefix = 'PV';
            break;
          case 'rapport_intervention':
            prefix = 'RI';
            break;
          case 'rapport_enquete':
            prefix = 'RE';
            break;
          case 'constat':
            prefix = 'CST';
            break;
          case 'convocation':
            prefix = 'CNV';
            break;
          case 'plainte':
            prefix = 'PLT';
            break;
        }
        
        const count = await Rapport.count({
          where: {
            type: rapport.type,
            created_at: {
              [Op.gte]: new Date(year, today.getMonth(), 1),
              [Op.lt]: new Date(year, today.getMonth() + 1, 1)
            }
          }
        });
        
        rapport.numero = `${prefix}${year}${month}${(count + 1).toString().padStart(4, '0')}`;
      }
    }
  },
  indexes: [
    {
      fields: ['numero']
    },
    {
      fields: ['type', 'statut']
    },
    {
      fields: ['redacteur_id', 'created_at']
    },
    {
      fields: ['intervention_id']
    },
    {
      fields: ['date_faits']
    },
    {
      fields: ['classification']
    }
  ]
});

// Associations
Rapport.associate = function(models) {
  Rapport.belongsTo(models.User, {
    foreignKey: 'redacteur_id',
    as: 'redacteur'
  });
  
  Rapport.belongsTo(models.Intervention, {
    foreignKey: 'intervention_id',
    as: 'intervention'
  });
  
  Rapport.belongsTo(models.Poste, {
    foreignKey: 'poste_id',
    as: 'poste'
  });
  
  Rapport.belongsTo(models.Rapport, {
    foreignKey: 'rapport_parent_id',
    as: 'rapport_parent'
  });
  
  Rapport.hasMany(models.Rapport, {
    foreignKey: 'rapport_parent_id',
    as: 'versions'
  });
};

// Méthodes d'instance
Rapport.prototype.valider = function(validateurId, commentaires = null) {
  const validation = {
    validateur_id: validateurId,
    date: new Date(),
    commentaires: commentaires
  };
  
  this.validation = this.validation ? [...this.validation, validation] : [validation];
  this.statut = 'valide';
  
  return this.save();
};

Rapport.prototype.transmettre = function(destinataire, mode = 'electronique') {
  const transmission = {
    destinataire: destinataire,
    mode: mode,
    date: new Date(),
    statut: 'transmis'
  };
  
  this.transmission = this.transmission ? [...this.transmission, transmission] : [transmission];
  this.statut = 'transmis';
  
  return this.save();
};

Rapport.prototype.cloturer = function(motif = null) {
  this.statut = 'clos';
  this.date_cloture = new Date();
  if (motif) {
    this.observations = (this.observations || '') + `\nCloture: ${motif}`;
  }
  
  return this.save();
};

Rapport.prototype.creerNouveleVersion = function(modifications) {
  const nouvelleVersion = {
    ...this.toJSON(),
    id: undefined,
    numero: undefined,
    version: this.version + 1,
    rapport_parent_id: this.id,
    statut: 'brouillon',
    validation: null,
    transmission: null,
    ...modifications
  };
  
  return Rapport.create(nouvelleVersion);
};

Rapport.prototype.genererPDF = function() {
  // Cette méthode sera implémentée pour générer le PDF du rapport
  // en utilisant une bibliothèque comme PDFKit
  return {
    success: true,
    message: 'Génération PDF en cours...',
    filename: `${this.numero}.pdf`
  };
};

Rapport.prototype.ajouterMotsCles = function(motsCles) {
  const existants = this.mots_cles || [];
  const nouveaux = motsCles.filter(mot => !existants.includes(mot));
  
  this.mots_cles = [...existants, ...nouveaux];
  return this.save();
};

Rapport.prototype.estModifiable = function() {
  return ['brouillon', 'redige'].includes(this.statut);
};

Rapport.prototype.necessiteValidation = function() {
  return this.statut === 'redige' && !this.validation;
};

// Méthodes de classe
Rapport.rechercherParMotsCles = function(motsCles) {
  return this.findAll({
    where: {
      [Op.or]: [
        { mots_cles: { [Op.overlap]: motsCles } },
        { titre: { [Op.iLike]: `%${motsCles.join('%')}%` } },
        { contenu: { [Op.iLike]: `%${motsCles.join('%')}%` } }
      ]
    },
    order: [['created_at', 'DESC']]
  });
};

Rapport.rapportsEnAttente = function(posteId = null) {
  const where = {
    statut: ['redige', 'valide'],
    transmission: null
  };
  
  if (posteId) {
    where.poste_id = posteId;
  }
  
  return this.findAll({
    where,
    order: [['priorite', 'DESC'], ['created_at', 'ASC']]
  });
};

module.exports = Rapport;