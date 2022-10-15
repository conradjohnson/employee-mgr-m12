const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Employee extends Model {}
Employee.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: " ",
      },
      last_name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      role_id:{
        type: DataTypes.INTEGER,
        defaultValue: 1,
        references: {
          model: 'role',
          key: 'id',
        },
      },
      manager_id:{
        type: DataTypes.INTEGER,
        defaultValue: 1,
        references: {
          model: 'employee',
          key: 'id',
        },
      },
      

    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: 'employee',
    }
  );
  
  module.exports = Employee;