'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
      full_name: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : 'Full Name cannot be ommited'
        }
      }
    },
    email: {
      type : DataTypes.STRING,
      allowNull : false,
      unique: true,
      validate : {
        notNull: {
          msg: 'Email cannot be omitted'
            },
        notEmpty: {
          msg: 'Email cannot be an empty string'
            },
        isEmail: {
          msg: 'Wrong email format'
            }
      }
    },
    username: {
      type : DataTypes.STRING,
      allowNull : false,
      unique: true,
      validate : {
        notNull : {
          msg : 'Username cannot br omitted'
        }
      }
    },
    password: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : 'Password cannot be omitted'
        }
      }
    },
    profile_image_url: {
      type : DataTypes.TEXT,
      allowNull : false,
      validate : {
        notNull : {
          msg : 'Profile URL Image cannot be omitted'
        },
        isUrl: {
          msg : 'Not URL'
        }
      }
    },
    age: {
      type : DataTypes.INTEGER,
      allowNull : false,
      validate : {
        notNull : {
          msg : 'Age connot be omitted'
        },
        isInt : {
          msg : 'Not Integer'
        }
      }
    },
    phone_number: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : 'Phone Number connot be omitted'
        },
        isNumeric: true,
        len: [12,12]
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
  });
  User.associate = (models) => {
  }
  return User;
};