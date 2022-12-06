'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SocialMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SocialMedia.init({
    name: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {
          msg : 'name cannot be omitted'
        }
      }
    },
    social_media_url: {
      type : DataTypes.TEXT,
      allowNull : false,
      validate : {
        notNull : {
          msg : 'social media url cannot be omitted'
        },
        isUrl : true
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
  }, {
    sequelize,
    modelName: 'SocialMedia',
    timestamps: false,
  });
  SocialMedia.associate = (models) => {
    SocialMedia.belongsTo(models.User)
  }
  return SocialMedia;
};