const inquirer = require('inquirer');
const  {add_emp_menu}  = require('./menus');
const sequelize = require('../config/connection');
const { Employee } = require('../models');



const employeeFunctions = async (menu_command) =>{
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
      case 'post_emp':
        reply = await postEmployee();
        break;
      case 'put_emp':
        console.log('todo: put emp');
        break;
      case 'del_emp':
        console.log('todo: put emp');
        break;  
    }
    return reply;
  };
  
  const getEmployees = async ()=>{
    // get 
    
    //const answer = await inquirer.prompt(add_emp_menu);
    const employeeListData = await Employee.findAll();
    const employeeList = employeeListData.map((employee)=> employee.get({plain: true}));
    console.table(employeeList);
    return true;
  }
  const postEmployee = async ()=>{
    let emp_obj = await inquirer.prompt(add_emp_menu);
    
    const newEmp = await Employee.create({
      ...emp_obj
    });
    await getEmployees();
    return newEmp;
  }

  module.exports = employeeFunctions;