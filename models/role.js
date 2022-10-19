const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Role extends Model {}
Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      salary: {
        type: DataTypes.FLOAT(12,2),
        allowNull: false,
        defaultValue: 0,
      },
      department_id:{
        type: DataTypes.INTEGER,
        defaultValue: 1,
        references: {
          model: 'department',
          key: 'id',
        },
      },
      

    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: 'role',
    }
  );
  
  module.exports = Role;