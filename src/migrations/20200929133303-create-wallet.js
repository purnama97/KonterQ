'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('wallets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
		allowNull:false,
        type: Sequelize.INTEGER,
        references:{
          model:'users',
          key:'id'
        },
        onDelete:'cascade',
        onUpdate:'cascade'
      },
      type: {
        type: Sequelize.STRING
      },
      gross_amount: {
        type: Sequelize.INTEGER
      },
      transaction_status: {
        type: Sequelize.STRING,
        defaultValue:"pending"
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('wallets');
  }
};