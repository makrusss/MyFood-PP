'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Item)
      User.hasOne(models.Profile)
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: {
          args :true,
          msg : "Username cannot be empty"
        },
        notEmpty :{
          args :true,
          msg : "Username cannot be empty"
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notNull: {
          args :true,
          msg : "Password cannot be empty"
        },
        notEmpty :{
          args :true,
          msg : "Password cannot be empty"
        },
        len:{
          args :[8,32],
          msg : "Password must be 8 - 32 character"
        }
      }
    },
    role: {
      type :DataTypes.STRING,
    }
  }, {
    hooks: {
      beforeCreate(instance, options) {
      const salt = bcrypt.genSaltSync(8);
      const hash = bcrypt.hashSync(instance.password, salt);
      instance.password = hash
      instance.role = 'customer'
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};