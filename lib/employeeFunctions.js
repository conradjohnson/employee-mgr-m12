const inquirer = require('inquirer');
const  {add_emp_menu}  = require('./menus');
const sequelize = require('../config/connection');
const { Department, Role, Employee } = require('../models');



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
      case 'back':
        console.log('going back');
        reply = 'back';
        break;  
    }
    return reply;
  };
  
  const getEmployees = async ()=>{
    
    //const answer = await inquirer.prompt(add_emp_menu);
    const employeeListData = await Employee.findAll({
      include: [{model:Role, include: Department}]
    });
    
     

    const employeeList = employeeListData.map((employee)=> employee.get({plain: true}));
    
    //tabelize the results
    empTable = await employeeTable(employeeList);
   
   
    console.table(empTable);
    return true;
  }

  const getManager = async (mgr_id) => {
    let mgr_data = await Employee.findOne({
      where:{
        id: mgr_id
      }
    });
    let mgr_obj = mgr_data.get({plain:true});
    let mgr_name = `${mgr_obj.first_name} ${mgr_obj.last_name} id#${mgr_obj.id}`;
    return mgr_name;
  }

  const employeeTable = async (employeeList) =>{
    
    let employee_table = await Promise.all(employeeList.map(async (employee)=> {
    const row = {}
     row.id = employee.id;
     row.name = employee.first_name + " " + employee.last_name; 
     row.title = employee.role.title;
     row.deptartment = employee.role.department.name;
     row.manager = await getManager(employee.manager_id);
    return row;
  }));
    return employee_table
  }

  
  const postEmployee = async ()=>{
    let addempmenu = await add_emp_menu();
    let emp_obj = await inquirer.prompt(addempmenu);
    
    const newEmp = await Employee.create({
      ...emp_obj
    });
    await getEmployees();
    return newEmp;
  }

  module.exports = employeeFunctions;