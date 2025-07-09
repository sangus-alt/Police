const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Verbalisation = sequelize.define('Verbalisation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  numero_pv: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.ENUM('contravention', 'amende', 'mise_fourriere', 'immobilisation'),
    allowNull: false
  },
  infraction: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  code_infraction: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  montant: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  vehicule_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'vehicules',
      key: 'id'
    }
  },
  plaque_immatriculation: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  conducteur_nom: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  conducteur_cni: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  permis_conduire: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  agent_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  poste_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'postes',
      key: 'id'
    }
  },
  date_infraction: {
    type: DataTypes.DATE,
    allowNull: false
  },
  lieu_infraction: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  statut: {
    type: DataTypes.ENUM('emise', 'payee', 'contestee', 'annulee', 'prescrite'),
    allowNull: false,
    defaultValue: 'emise'
  },
  date_paiement: {
    type: DataTypes.DATE,
    allowNull: true
  },
  mode_paiement: {
    type: DataTypes.ENUM('especes', 'cheque', 'virement', 'mobile_money'),
    allowNull: true
  },
  observations: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'verbalisations',
  hooks: {
    beforeCreate: async (verbalisation) => {
      if (!verbalisation.numero_pv) {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        
        const count = await Verbalisation.count({
          where: sequelize.where(
            sequelize.fn('DATE', sequelize.col('created_at')),
            today.toISOString().split('T')[0]
          )
        });
        
        verbalisation.numero_pv = `PV${year}${month}${day}${(count + 1).toString().padStart(4, '0')}`;
      }
    }
  }
});

Verbalisation.associate = function(models) {
  Verbalisation.belongsTo(models.Vehicule, {
    foreignKey: 'vehicule_id',
    as: 'vehicule'
  });
  
  Verbalisation.belongsTo(models.User, {
    foreignKey: 'agent_id',
    as: 'agent'
  });
  
  Verbalisation.belongsTo(models.Poste, {
    foreignKey: 'poste_id',
    as: 'poste'
  });
};

Verbalisation.prototype.marquerPayee = function(modePaiement) {
  this.statut = 'payee';
  this.date_paiement = new Date();
  this.mode_paiement = modePaiement;
  return this.save();
};

module.exports = Verbalisation;