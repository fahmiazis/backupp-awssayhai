'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class friends extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      friends.belongsTo(models.user, {
        foreignKey: 'friendId',
        as: 'friend',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    }
  };
  friends.init({
    name: DataTypes.STRING,
    friendId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'friends',
  });
  return friends;
};