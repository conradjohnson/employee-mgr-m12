const inquirer = require('inquirer');
const  {add_emp_menu, emp_by_mgr_menu, emp_by_dept_menu}  = require('./menus');
const sequelize = require('../config/connection');
const { Department, Role, Employee } = require('../models');



const employeeFunctions = async (menu_command) =>{
    let reply = 'no action';
    switch(menu_command) {
      case 'get_emp':
        reply = await getEmployees();
        break;
      case 'get_emp_mgr':
        reply = await getEmployeesByMgr();
        break;
      case 'get_emp_dept':
        reply = await getEmployeesByDept();
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
      row.salary = employee.role.salary;
      row.deptartment = employee.role.department.name;
      row.manager = await getManager(employee.manager_id);
    return row;
  }));
  return employee_table
}

const getEmployeesByMgr = async ()=>{
  let getempbymgrmenu = await emp_by_mgr_menu();
  let mgr_choice = await inquirer.prompt(getempbymgrmenu);
 
  const empsByMgrData = await Employee.findAll({ where: {
    manager_id: mgr_choice.emp_by_mgr_menu
  }, include: [{model:Role, include: Department}]})
  const empsByMgr = empsByMgrData.map((emp)=>emp.get({plain:true}));
  let emp_table = await employeeTable(empsByMgr);
  console.table(emp_table);
  return true;
}


const getEmployeesByDept = async ()=>{
  let getempbydeptmenu = await emp_by_dept_menu();
  let dept_choice = await inquirer.prompt(getempbydeptmenu);
  //dept_choice.emp_by_dept_menu
  
  const deptObjData = await Department.findByPk(dept_choice.emp_by_dept_menu);
  let deptObj = deptObjData.get({plain:true});
  const roleObjData = await Role.findAll({where:{department_id:deptObj.id}});
  const roleObj = roleObjData.map((role)=>role.get({plain:true}));

  const empArray = [];
  let empRow = {};

  //for (const element of array1) {
    for (const role of roleObj){
  //await roleObj.forEach(async (role)=>{
    let empObjData = await Employee.findAll({ where:{ role_id: role.id}});
    let empObj = empObjData.map((emp)=>emp.get({plain:true}));
    empObj.forEach((emp)=>{
      //console.log('inside emp loop')
      empRow = {
        id: emp.id,
        first_name: emp.first_name,
        last_name: emp.last_name,
        manager_id: emp.manager_id, 
        role: {
          title: role.title,
          salary: role.salary,
          department: {
            name: deptObj.name
          }
        }
      }
      //console.log(empRow);
      empArray.push(empRow);
      //console.log(empArray);
      empRow = {};
    })
  }
  //console.log(empArray);


      // employeeTable is expecting an array of objects like this:
        // [{
        //   id: [id],
        //   first_name: [first_name],
        //   last_name: [last_name],
        //   manager_id: [manager_id],
        //   role: {
        //     title: [title],
        //     salary: [salary],
        //     department:{
        //       name: [departmentname]
        //     }
        //   }
        // }]
  

  
  //console.log(empArray);
  let emp_table = await employeeTable(empArray);
  console.table(emp_table);
  return true;
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