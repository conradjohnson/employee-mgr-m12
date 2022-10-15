const sequelize = require('../config/connection');
const { Department, Role, Employee } = require('../models');

const deptData = require('./deptData.json');
const roleData = require('./roleData.json');
const empData = require('./empData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const depts = await Department.bulkCreate(deptData, {
    individualHooks: true,
    returning: true,
  });

  // for (const dept of deptData) {
  //   await Department.create({
  //     dept
  //   }, {
  //     individualHooks: true,
  //     returning: true,
  //   });

  const roles = await Role.bulkCreate(roleData, {
    individualHooks: true,
    returning: true,
  });
  const emps = await Employee.bulkCreate(empData, {
    individualHooks: true,
    returning: true,
  });
    

  process.exit(0);
};

seedDatabase();
