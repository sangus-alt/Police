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
  administration_proprietaire: {
    type: DataTypes.STRING(200),
    allowNull: true,
    comment: 'Nom de l\'administration propriétaire si applicable'
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
  carte_grise_photo: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Photo de la carte grise'
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
  assurance_photo: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Photo de l\'attestation d\'assurance'
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
  visite_technique_photo: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Photo du certificat de visite technique'
  },
  permis_conduire_numero: {
    type: DataTypes.STRING(50),
    allowNull: true,
    comment: 'Numéro de permis de conduire du propriétaire principal'
  },
  permis_conduire_categorie: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Catégorie du permis de conduire'
  },
  permis_conduire_photo: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Photo du permis de conduire'
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
  photo_arriere: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Chemin vers la photo arrière du véhicule'
  },
  photo_interieur: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Chemin vers la photo intérieur du véhicule'
  },
  photos_supplementaires: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Photos supplémentaires du véhicule et documents'
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
  agent_derniere_verification_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: 'Agent ayant effectué la dernière vérification'
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
  date_signalement: {
    type: DataTypes.DATE,
    allowNull: true
  },
  agent_signalement_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  qr_code: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'QR Code généré pour identification rapide'
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
      fields: ['numero_carte_grise']
    },
    {
      fields: ['proprietaire_cni']
    },
    {
      fields: ['proprietaire_nom']
    },
    {
      fields: ['administration_proprietaire']
    },
    {
      fields: ['permis_conduire_numero']
    },
    {
      fields: ['statut']
    },
    {
      fields: ['type_vehicule']
    },
    {
      fields: ['signalement_actif']
    },
    {
      // Index composé pour recherche rapide
      fields: ['plaque_immatriculation', 'proprietaire_nom', 'numero_carte_grise']
    }
  ]
});

// Associations
Vehicule.associate = function(models) {
  Vehicule.belongsTo(models.User, {
    foreignKey: 'created_by',
    as: 'createur'
  });
  
  Vehicule.belongsTo(models.User, {
    foreignKey: 'agent_derniere_verification_id',
    as: 'agent_derniere_verification'
  });
  
  Vehicule.belongsTo(models.User, {
    foreignKey: 'agent_signalement_id',
    as: 'agent_signalement'
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

Vehicule.prototype.signalerVol = function(motif, agentId) {
  this.statut = 'vole';
  this.signalement_actif = true;
  this.motif_signalement = motif;
  this.date_signalement = new Date();
  this.agent_signalement_id = agentId;
  return this.save();
};

Vehicule.prototype.leverSignalement = function() {
  this.signalement_actif = false;
  this.motif_signalement = null;
  this.date_signalement = null;
  this.agent_signalement_id = null;
  if (this.statut === 'vole') {
    this.statut = 'actif';
  }
  return this.save();
};

Vehicule.prototype.genererQRCode = function() {
  const data = {
    plaque: this.plaque_immatriculation,
    chassis: this.numero_chassis,
    proprietaire: this.proprietaire_nom,
    id: this.id
  };
  this.qr_code = JSON.stringify(data);
  return this.save();
};

// Méthodes de classe avec filtres rapides
Vehicule.rechercheRapide = function(query) {
  if (!query || query.length < 2) {
    return this.findAll({ limit: 20, order: [['created_at', 'DESC']] });
  }
  
  const searchQuery = `%${query.toUpperCase()}%`;
  
  return this.findAll({
    where: {
      [Op.or]: [
        { plaque_immatriculation: { [Op.iLike]: searchQuery } },
        { numero_carte_grise: { [Op.iLike]: searchQuery } },
        { numero_chassis: { [Op.iLike]: searchQuery } },
        { proprietaire_nom: { [Op.iLike]: searchQuery } },
        { proprietaire_cni: { [Op.iLike]: searchQuery } },
        { administration_proprietaire: { [Op.iLike]: searchQuery } },
        { permis_conduire_numero: { [Op.iLike]: searchQuery } }
      ]
    },
    include: [
      { model: sequelize.models.User, as: 'createur', attributes: ['nom', 'prenoms'] }
    ],
    order: [['created_at', 'DESC']],
    limit: 50
  });
};

Vehicule.filtreParPlaque = function(plaque) {
  return this.findAll({
    where: {
      plaque_immatriculation: { [Op.iLike]: `%${plaque}%` }
    },
    order: [['plaque_immatriculation', 'ASC']]
  });
};

Vehicule.filtreParCarteGrise = function(numeroCarteGrise) {
  return this.findAll({
    where: {
      numero_carte_grise: { [Op.iLike]: `%${numeroCarteGrise}%` }
    },
    order: [['numero_carte_grise', 'ASC']]
  });
};

Vehicule.filtreParPermis = function(numeroPermis) {
  return this.findAll({
    where: {
      permis_conduire_numero: { [Op.iLike]: `%${numeroPermis}%` }
    },
    order: [['permis_conduire_numero', 'ASC']]
  });
};

Vehicule.filtreParProprietaire = function(nomProprietaire) {
  return this.findAll({
    where: {
      [Op.or]: [
        { proprietaire_nom: { [Op.iLike]: `%${nomProprietaire}%` } },
        { proprietaire_prenoms: { [Op.iLike]: `%${nomProprietaire}%` } }
      ]
    },
    order: [['proprietaire_nom', 'ASC']]
  });
};

Vehicule.filtreParAdministration = function(administration) {
  return this.findAll({
    where: {
      administration_proprietaire: { [Op.iLike]: `%${administration}%` }
    },
    order: [['administration_proprietaire', 'ASC']]
  });
};

Vehicule.vehiculesSignales = function() {
  return this.findAll({
    where: { signalement_actif: true },
    include: [
      { model: sequelize.models.User, as: 'agent_signalement', attributes: ['nom', 'prenoms'] }
    ],
    order: [['date_signalement', 'DESC']]
  });
};

Vehicule.vehiculesAvecPhotos = function() {
  return this.findAll({
    where: {
      [Op.or]: [
        { photo_face: { [Op.ne]: null } },
        { photo_profil: { [Op.ne]: null } },
        { photo_arriere: { [Op.ne]: null } },
        { carte_grise_photo: { [Op.ne]: null } },
        { assurance_photo: { [Op.ne]: null } },
        { permis_conduire_photo: { [Op.ne]: null } }
      ]
    },
    order: [['created_at', 'DESC']]
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

Vehicule.statistiquesPhotos = function() {
  return this.findAll({
    attributes: [
      [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
      [sequelize.fn('COUNT', sequelize.col('photo_face')), 'avec_photo_face'],
      [sequelize.fn('COUNT', sequelize.col('photo_profil')), 'avec_photo_profil'],
      [sequelize.fn('COUNT', sequelize.col('carte_grise_photo')), 'avec_carte_grise'],
      [sequelize.fn('COUNT', sequelize.col('assurance_photo')), 'avec_assurance'],
      [sequelize.fn('COUNT', sequelize.col('permis_conduire_photo')), 'avec_permis']
    ],
    raw: true
  });
};

module.exports = Vehicule;