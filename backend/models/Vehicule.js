const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

const Vehicule = sequelize.define('Vehicule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  plaque_immatriculation: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  type_vehicule: {
    type: DataTypes.ENUM(
      'voiture_particuliere', 'moto', 'scooter', 'camion', 'bus', 'minibus',
      'taxi', 'camionnette', 'remorque', 'vehicule_agricole', 'vehicule_service',
      'vehicule_diplomatique', 'autre'
    ),
    allowNull: false
  },
  marque: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  modele: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  couleur_principale: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  couleur_secondaire: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  annee_fabrication: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1900,
      max: new Date().getFullYear() + 1
    }
  },
  numero_chassis: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  numero_moteur: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  cylindree: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Cylindrée en cm³'
  },
  puissance: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Puissance en chevaux'
  },
  carburant: {
    type: DataTypes.ENUM('essence', 'diesel', 'gpl', 'electrique', 'hybride', 'autre'),
    allowNull: true,
    defaultValue: 'essence'
  },
  nombre_places: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 100
    }
  },
  poids_vide: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    comment: 'Poids à vide en kg'
  },
  poids_total: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
    comment: 'Poids total autorisé en charge en kg'
  },
  proprietaire_nom: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  proprietaire_prenoms: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  proprietaire_type: {
    type: DataTypes.ENUM('particulier', 'entreprise', 'administration', 'association'),
    allowNull: false,
    defaultValue: 'particulier'
  },
  proprietaire_cni: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  proprietaire_telephone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  proprietaire_email: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  proprietaire_adresse: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date_mise_circulation: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  date_expiration_carte_grise: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  numero_carte_grise: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  assurance_compagnie: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  assurance_numero: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  date_expiration_assurance: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  visite_technique_valide: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  date_expiration_visite: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  centre_visite: {
    type: DataTypes.STRING(150),
    allowNull: true
  },
  statut: {
    type: DataTypes.ENUM('actif', 'suspendu', 'vole', 'accident', 'detruit', 'export', 'archive'),
    allowNull: false,
    defaultValue: 'actif'
  },
  photo_face: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Chemin vers la photo de face du véhicule'
  },
  photo_profil: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Chemin vers la photo de profil du véhicule'
  },
  photos_supplementaires: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Photos supplémentaires du véhicule'
  },
  caracteristiques_speciales: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Caractéristiques spéciales, équipements, modifications'
  },
  usage_principal: {
    type: DataTypes.ENUM(
      'personnel', 'commercial', 'transport_public', 'livraison', 
      'agricole', 'service_public', 'taxi', 'location', 'autre'
    ),
    allowNull: false,
    defaultValue: 'personnel'
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  derniere_verification: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Dernière vérification par les forces de l\'ordre'
  },
  signalement_actif: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Véhicule faisant l\'objet d\'un signalement'
  },
  motif_signalement: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'vehicules',
  indexes: [
    {
      fields: ['plaque_immatriculation']
    },
    {
      fields: ['numero_chassis']
    },
    {
      fields: ['proprietaire_cni']
    },
    {
      fields: ['statut']
    },
    {
      fields: ['type_vehicule']
    },
    {
      fields: ['signalement_actif']
    }
  ]
});

// Associations
Vehicule.associate = function(models) {
  Vehicule.belongsTo(models.User, {
    foreignKey: 'created_by',
    as: 'createur'
  });
  
  Vehicule.hasMany(models.Verbalisation, {
    foreignKey: 'vehicule_id',
    as: 'verbalisations'
  });
  
  Vehicule.hasMany(models.ControleVehicule, {
    foreignKey: 'vehicule_id',
    as: 'controles'
  });
};

// Méthodes d'instance
Vehicule.prototype.estEnRegle = function() {
  const maintenant = new Date();
  
  // Vérifier l'assurance
  if (this.date_expiration_assurance && this.date_expiration_assurance < maintenant) {
    return false;
  }
  
  // Vérifier la visite technique
  if (this.date_expiration_visite && this.date_expiration_visite < maintenant) {
    return false;
  }
  
  // Vérifier la carte grise
  if (this.date_expiration_carte_grise && this.date_expiration_carte_grise < maintenant) {
    return false;
  }
  
  return this.statut === 'actif';
};

Vehicule.prototype.getDocumentsExpires = function() {
  const maintenant = new Date();
  const expires = [];
  
  if (this.date_expiration_assurance && this.date_expiration_assurance < maintenant) {
    expires.push('assurance');
  }
  
  if (this.date_expiration_visite && this.date_expiration_visite < maintenant) {
    expires.push('visite_technique');
  }
  
  if (this.date_expiration_carte_grise && this.date_expiration_carte_grise < maintenant) {
    expires.push('carte_grise');
  }
  
  return expires;
};

Vehicule.prototype.getProchaines = function(joursAvance = 30) {
  const limite = new Date();
  limite.setDate(limite.getDate() + joursAvance);
  
  const prochaines = [];
  
  if (this.date_expiration_assurance && this.date_expiration_assurance <= limite) {
    prochaines.push({
      type: 'assurance',
      date: this.date_expiration_assurance
    });
  }
  
  if (this.date_expiration_visite && this.date_expiration_visite <= limite) {
    prochaines.push({
      type: 'visite_technique',
      date: this.date_expiration_visite
    });
  }
  
  if (this.date_expiration_carte_grise && this.date_expiration_carte_grise <= limite) {
    prochaines.push({
      type: 'carte_grise',
      date: this.date_expiration_carte_grise
    });
  }
  
  return prochaines.sort((a, b) => a.date - b.date);
};

Vehicule.prototype.signalerVol = function(motif) {
  this.statut = 'vole';
  this.signalement_actif = true;
  this.motif_signalement = motif;
  return this.save();
};

Vehicule.prototype.leverSignalement = function() {
  this.signalement_actif = false;
  this.motif_signalement = null;
  if (this.statut === 'vole') {
    this.statut = 'actif';
  }
  return this.save();
};

// Méthodes de classe
Vehicule.rechercherParPlaque = function(plaque) {
  return this.findOne({
    where: { plaque_immatriculation: plaque },
    include: [
      { model: sequelize.models.User, as: 'createur', attributes: ['nom', 'prenoms'] }
    ]
  });
};

Vehicule.vehiculesSignales = function() {
  return this.findAll({
    where: { signalement_actif: true },
    order: [['updated_at', 'DESC']]
  });
};

Vehicule.documentsExpirant = function(jours = 30) {
  const limite = new Date();
  limite.setDate(limite.getDate() + jours);
  
  return this.findAll({
    where: {
      [Op.or]: [
        { date_expiration_assurance: { [Op.lte]: limite } },
        { date_expiration_visite: { [Op.lte]: limite } },
        { date_expiration_carte_grise: { [Op.lte]: limite } }
      ],
      statut: 'actif'
    },
    order: [['date_expiration_assurance', 'ASC']]
  });
};

module.exports = Vehicule;