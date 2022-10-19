const inquirer = require('inquirer');
const  {add_emp_menu}  = require('./menus');
const sequelize = require('../config/connection');
const { Department, Role, Employee } = require('../models');


const roleFunctions = async (menu_command) =>{
    let reply = 'no action';
    switch(menu_command) {
      case 'get_emp':
        reply = await getEmployees();
        break;
      case 'get_emp_mgr':
        //reply = await getEmpByMgr();
        break;
      case 'get_emp_dept':
        console.log('todo: emp by dept');
        break;
      case 'back':
        console.log('going back');
        reply = 'back';
        break;  
    }
    return reply;
  };





module.exports = roleFunctions;