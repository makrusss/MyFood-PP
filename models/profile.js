'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile.belongsTo(models.User)
    }
    static moneyChanges(totalPrice) {
      let x = this.saldo - totalPrice
      return x
    }

    get genderName() {
      if (this.gender === 'Male') {
        return this.gender = `Mr.${this.name}`
      }
      if (this.gender === 'Female') {
        return this.gender = `Mrs.${this.name}`
      }
    }
  }
  Profile.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Name cannot be empty"
        },
        notEmpty: {
          args: true,
          msg: "Name cannot be empty"
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Adress cannot be empty"
        },
        notEmpty: {
          args: true,
          msg: "Adress cannot be empty"
        }
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Phone Number cannot be empty"
        },
        notEmpty: {
          args: true,
          msg: "Phone Number cannot be empty"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email address already in use!'
      },
      validate: {
        notEmpty: {
          args: true,
          msg: "Email-id required"
        },
        isEmail: {
          args: true,
          msg: 'Valid email-id required'
        }
      },
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Gender cannot be empty"
        },
        notEmpty: {
          args: true,
          msg: "Gender cannot be empty"
        }
      }
    },
    saldo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: "Balance cannot be empty"
        },
        notEmpty: {
          args: true,
          msg: "Balance cannot be empty"
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};