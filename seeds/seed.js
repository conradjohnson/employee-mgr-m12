const sequelize = require('../config/connection');
const { Department, Role, Employee } = require('../models');

const deptData = require('./deptData.json');
const roleData = require('./roleData.json');
const empData = require('./empData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

   

  for (const dept of deptData) {
    await Department.create({
        ...dept
      }, {
        individualHooks: true,
        returning: true
      })

  };


 
  for (const role of roleData){
    await Role.create({
      ...role
    }, {
      individualHooks: true,
      returning: true
    })
  }
  
    
  for (const emp of empData){
    await Employee.create({
      ...emp
    }, {
      individualHooks: true,
      returning: true
    })
  }

  process.exit(0);
};

seedDatabase();
