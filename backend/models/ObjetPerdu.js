const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

const ObjetPerdu = sequelize.define('ObjetPerdu', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_ticket: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: 'Numéro unique du ticket d\'objet perdu/trouvé'
  },
  type_operation: {
    type: DataTypes.ENUM('perdu', 'trouve'),
    allowNull: false
  },
  statut: {
    type: DataTypes.ENUM('en_attente', 'en_depot', 'restitue', 'detruit', 'vendu'),
    allowNull: false,
    defaultValue: 'en_attente'
  },
  categorie: {
    type: DataTypes.ENUM(
      'papiers_identite', 'portefeuille', 'telephone', 'cles', 'bijoux', 
      'vetements', 'sac', 'electronique', 'vehicule', 'documents', 'autre'
    ),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [10, 1000]
    }
  },
  marque: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  modele: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  couleur: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  taille: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  numero_serie: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Numéro de série ou IMEI pour électronique'
  },
  valeur_estimee: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true,
    comment: 'Valeur estimée en FCFA'
  },
  etat_objet: {
    type: DataTypes.ENUM('neuf', 'bon', 'usage', 'deteriore', 'endommage'),
    allowNull: false,
    defaultValue: 'bon'
  },
  date_perte: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Date de perte déclarée par le propriétaire'
  },
  date_decouverte: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Date de découverte de l\'objet trouvé'
  },
  lieu_perte: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Lieu de perte déclaré'
  },
  lieu_decouverte: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Lieu où l\'objet a été trouvé'
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  poste_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'postes',
      key: 'id'
    }
  },
  declarant_nom: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  declarant_prenoms: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  declarant_telephone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  declarant_email: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  declarant_cni: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  declarant_adresse: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  proprietaire_presume_nom: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Nom du propriétaire si connu (documents d\'identité)'
  },
  proprietaire_presume_telephone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  proprietaire_presume_adresse: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  requerant_nom: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Personne qui réclame l\'objet'
  },
  requerant_prenoms: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  requerant_telephone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  requerant_cni: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  requerant_lien_proprietaire: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Lien avec le propriétaire (propriétaire, famille, mandataire, etc.)'
  },
  preuves_propriete: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Documents prouvant la propriété'
  },
  photos: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Photos de l\'objet'
  },
  agent_depot_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Agent qui a enregistré le dépôt'
  },
  agent_restitution_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Agent qui a effectué la restitution'
  },
  date_restitution: {
    type: DataTypes.DATE,
    allowNull: true
  },
  emplacement_stockage: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Lieu de stockage dans le poste'
  },
  delai_conservation: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 90,
    comment: 'Délai de conservation en jours'
  },
  date_limite_conservation: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Date limite de conservation calculée automatiquement'
  },
  notification_envoyee: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Notification envoyée au propriétaire présumé'
  },
  frais_stockage: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Frais de stockage en FCFA'
  },
  frais_restitution: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Frais de restitution en FCFA'
  },
  paiement_effectue: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  correspondance_possible: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'IDs des objets trouvés/perdus pouvant correspondre'
  }
}, {
  tableName: 'objets_perdus',
  hooks: {
    beforeCreate: async (objet) => {
      // Génération du numéro de ticket
      if (!objet.numero_ticket) {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        
        const prefix = objet.type_operation === 'perdu' ? 'PER' : 'TRV';
        
        const count = await ObjetPerdu.count({
          where: {
            type_operation: objet.type_operation,
            created_at: {
              [Op.gte]: new Date(year, today.getMonth(), today.getDate()),
              [Op.lt]: new Date(year, today.getMonth(), today.getDate() + 1)
            }
          }
        });
        
        objet.numero_ticket = `${prefix}${year}${month}${day}${(count + 1).toString().padStart(3, '0')}`;
      }
      
      // Calcul de la date limite de conservation
      if (!objet.date_limite_conservation && objet.delai_conservation) {
        const dateDepot = objet.date_decouverte || new Date();
        const dateLimite = new Date(dateDepot);
        dateLimite.setDate(dateLimite.getDate() + objet.delai_conservation);
        objet.date_limite_conservation = dateLimite;
      }
    }
  },
  indexes: [
    {
      fields: ['numero_ticket']
    },
    {
      fields: ['type_operation', 'statut']
    },
    {
      fields: ['categorie']
    },
    {
      fields: ['poste_id', 'created_at']
    },
    {
      fields: ['declarant_telephone']
    },
    {
      fields: ['date_limite_conservation']
    }
  ]
});

// Associations
ObjetPerdu.associate = function(models) {
  ObjetPerdu.belongsTo(models.Poste, {
    foreignKey: 'poste_id',
    as: 'poste'
  });
  
  ObjetPerdu.belongsTo(models.User, {
    foreignKey: 'agent_depot_id',
    as: 'agent_depot'
  });
  
  ObjetPerdu.belongsTo(models.User, {
    foreignKey: 'agent_restitution_id',
    as: 'agent_restitution'
  });
};

// Méthodes d'instance
ObjetPerdu.prototype.genererTicket = function() {
  return {
    numero: this.numero_ticket,
    type: this.type_operation,
    description: this.description,
    date: this.created_at,
    poste: this.poste?.nom,
    declarant: `${this.declarant_nom} ${this.declarant_prenoms || ''}`.trim(),
    date_limite: this.date_limite_conservation
  };
};

ObjetPerdu.prototype.restituer = function(agentId, requerantInfo, frais = 0) {
  this.statut = 'restitue';
  this.agent_restitution_id = agentId;
  this.date_restitution = new Date();
  this.frais_restitution = frais;
  this.paiement_effectue = frais === 0 ? true : false;
  
  if (requerantInfo) {
    this.requerant_nom = requerantInfo.nom;
    this.requerant_prenoms = requerantInfo.prenoms;
    this.requerant_telephone = requerantInfo.telephone;
    this.requerant_cni = requerantInfo.cni;
    this.requerant_lien_proprietaire = requerantInfo.lien;
  }
  
  return this.save();
};

ObjetPerdu.prototype.estExpire = function() {
  if (!this.date_limite_conservation) return false;
  return new Date() > this.date_limite_conservation;
};

ObjetPerdu.prototype.joursRestants = function() {
  if (!this.date_limite_conservation) return null;
  const maintenant = new Date();
  const diffTime = this.date_limite_conservation - maintenant;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

ObjetPerdu.prototype.rechercherCorrespondances = function() {
  const typeRecherche = this.type_operation === 'perdu' ? 'trouve' : 'perdu';
  
  return ObjetPerdu.findAll({
    where: {
      type_operation: typeRecherche,
      categorie: this.categorie,
      statut: ['en_attente', 'en_depot'],
      // Recherche dans une zone géographique proche si coordonnées disponibles
      ...(this.latitude && this.longitude ? {
        latitude: {
          [Op.between]: [this.latitude - 0.01, this.latitude + 0.01]
        },
        longitude: {
          [Op.between]: [this.longitude - 0.01, this.longitude + 0.01]
        }
      } : {}),
      // Correspondance temporelle (±7 jours)
      created_at: {
        [Op.between]: [
          new Date(this.created_at.getTime() - 7 * 24 * 60 * 60 * 1000),
          new Date(this.created_at.getTime() + 7 * 24 * 60 * 60 * 1000)
        ]
      }
    },
    order: [['created_at', 'DESC']]
  });
};

ObjetPerdu.prototype.calculerFraisStockage = function() {
  if (this.statut !== 'en_depot') return 0;
  
  const joursStockage = Math.floor((new Date() - this.created_at) / (1000 * 60 * 60 * 24));
  const tarifJournalier = 500; // 500 FCFA par jour
  
  return Math.max(0, (joursStockage - 7) * tarifJournalier); // Gratuit les 7 premiers jours
};

// Méthodes de classe
ObjetPerdu.objetsExpires = function() {
  return this.findAll({
    where: {
      date_limite_conservation: {
        [Op.lt]: new Date()
      },
      statut: ['en_attente', 'en_depot']
    },
    order: [['date_limite_conservation', 'ASC']]
  });
};

ObjetPerdu.objetsProchesExpiration = function(jours = 7) {
  const dateLimite = new Date();
  dateLimite.setDate(dateLimite.getDate() + jours);
  
  return this.findAll({
    where: {
      date_limite_conservation: {
        [Op.between]: [new Date(), dateLimite]
      },
      statut: ['en_attente', 'en_depot']
    },
    order: [['date_limite_conservation', 'ASC']]
  });
};

ObjetPerdu.rechercherPar = function(criteres) {
  const where = {};
  
  if (criteres.numero_ticket) {
    where.numero_ticket = { [Op.iLike]: `%${criteres.numero_ticket}%` };
  }
  
  if (criteres.description) {
    where.description = { [Op.iLike]: `%${criteres.description}%` };
  }
  
  if (criteres.categorie) {
    where.categorie = criteres.categorie;
  }
  
  if (criteres.telephone) {
    where[Op.or] = [
      { declarant_telephone: { [Op.iLike]: `%${criteres.telephone}%` } },
      { proprietaire_presume_telephone: { [Op.iLike]: `%${criteres.telephone}%` } }
    ];
  }
  
  return this.findAll({
    where,
    order: [['created_at', 'DESC']],
    include: [
      { model: sequelize.models.Poste, as: 'poste', attributes: ['nom'] },
      { model: sequelize.models.User, as: 'agent_depot', attributes: ['nom', 'prenoms'] }
    ]
  });
};

module.exports = ObjetPerdu;