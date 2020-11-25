'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      message.belongsTo(models.user, {
        foreignKey: 'sender',
        as: 'send',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })

      message.belongsTo(models.user, {
        foreignKey: 'recipient',
        as: 'receiver',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    }
  };
  message.init({
    content: DataTypes.STRING,
    recipient: DataTypes.INTEGER,
    sender: DataTypes.INTEGER,
    isLatest: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'message'
  })
  return message
}
