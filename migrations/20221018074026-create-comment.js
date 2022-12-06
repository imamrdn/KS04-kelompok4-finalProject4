'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
          type: Sequelize.INTEGER,
          references : {
            model : 'Users',
            key : 'id'
          },
          onUpdate : 'cascade',
          onDelete : 'cascade'
      },
      PhotoId: {
        type: Sequelize.INTEGER,
        references : {
          model : 'Photos',
          key : 'id'
        },
        onUpdate : 'cascade',
        onDelete : 'cascade'
      },
      comment: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Comments');
  }
};