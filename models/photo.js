'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Photo.init({
      title: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : 'Title cannot be omitted'
        }
      }
  },
    caption: {
      type : DataTypes.TEXT,
      allowNull : false,
      validate : {
        notNull : {
          msg : 'Caption cannot be omitted'
        }
      }
  },
    poster_image_url: {
      type : DataTypes.TEXT,
      allowNull : false,
      validate : {
        notNull: {
          msg: 'Image URL cannot be omitted'
          },
          notEmpty: {
            msg: 'Image URL cannot be an empty string'
            },
          isUrl: {
            msg: 'Wrong URL format'
            }
      }
  },
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'User ID cannot be omitted'
          },
          notEmpty: {
            msg: 'User ID cannot be an empty string'
          }
        }
      },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Photo',
  });
  Photo.associate = (models) => {
    Photo.hasMany(models.Comment)
    Photo.belongsTo(models.User)
  }
  return Photo;
};