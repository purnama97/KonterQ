'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('deposits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      status_code: {
        type: Sequelize.STRING
      },
      status_message: {
        type: Sequelize.STRING
      },
      transaction_id: {
        type: Sequelize.STRING
      },
      order_id: {
        type: Sequelize.STRING
      },
      gross_amount: {
        type: Sequelize.STRING
      },
      payment_type: {
        type: Sequelize.STRING
      },
      transaction_time: {
        type: Sequelize.STRING
      },
      transaction_status: {
        type: Sequelize.STRING
      },
      bank: {
        type: Sequelize.STRING
      },
      card_type: {
        type: Sequelize.STRING
      },
      fraud_status:{
        type: Sequelize.STRING
      },
      biller_code:{
        type: Sequelize.STRING
      },
      payment_code: {
        type: Sequelize.STRING
      },
      pdf_url: {
        type: Sequelize.STRING
      },
      finish_redirect_url:{
        type: Sequelize.STRING
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
    await queryInterface.dropTable('deposits');
  }
};