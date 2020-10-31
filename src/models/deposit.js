'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class deposit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
	  deposit.belongsTo(models.user)
    }
  };
  deposit.init({
    status_code: DataTypes.STRING,
    status_message: DataTypes.STRING,
    transaction_id: DataTypes.STRING,
    order_id: DataTypes.STRING,
    gross_amount: DataTypes.STRING,
    payment_type: DataTypes.STRING,
    transaction_time: DataTypes.STRING,
    transaction_status: DataTypes.STRING,
    bank: DataTypes.STRING,
    card_type: DataTypes.STRING,
    fraud_status:DataTypes.STRING,
    biller_code:DataTypes.STRING,
	payment_code:DataTypes.STRING,
    pdf_url: DataTypes.STRING,
    finish_redirect_url:DataTypes.STRING,
	userId:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'deposit',
  });
  return deposit;
};