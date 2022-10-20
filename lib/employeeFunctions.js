const inquirer = require('inquirer');
const  {add_emp_menu, emp_by_mgr_menu, emp_by_dept_menu, get_emp_to_update_menu, update_emp_menu, delete_emp_menu}  = require('./menus');
const sequelize = require('../config/connection');
const { Department, Role, Employee } = require('../models');
const cTable = require('console.table');



// main function that catches all actions from Employee Menu
// based on the employee menu selection, will perform function
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
        reply = await updateEmployee();
        break;
      case 'del_emp':
        reply = await deleteEmployee();
        break;
      case 'back':
        reply = 'back';
        break;  
    }
    return reply;
};


// helper function to format employee data sets for table output
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
const employeeTable = async (employeeList) =>{
  
  let employee_table = await Promise.all(employeeList.map(async (employee)=> {
    const row = {}
      row.id = employee.id;
      row.name = employee.first_name + " " + employee.last_name; 
      row.title = employee.role.title;
      row.salary = "$"+employee.role.salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      row.deptartment = employee.role.department.name;
      row.manager = await getManager(employee.manager_id);
    return row;
  }));
  return employee_table
}

// helper function to get Manager Names for Employees
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

// get all employees and output a table to screen
const getEmployees = async ()=>{
  // get all employees in a usable object
  const employeeListData = await Employee.findAll({
    include: [{model:Role, include: Department}]
  });
  const employeeList = employeeListData.map((employee)=> employee.get({plain: true}));
  
  //format results for us to use in a table
  empTable = await employeeTable(employeeList);
  //output the table  
  let table = cTable.getTable(empTable);
  console.log(table);
  return true;
}

// get all employees by manager.
const getEmployeesByMgr = async ()=>{
  //first let the user select the Manager
  let getempbymgrmenu = await emp_by_mgr_menu();
  let mgr_choice = await inquirer.prompt(getempbymgrmenu);
 
  //find all employees by that manager
  const empsByMgrData = await Employee.findAll({ where: {
    manager_id: mgr_choice.emp_by_mgr_menu
  }, include: [{model:Role, include: Department}]})
  const empsByMgr = empsByMgrData.map((emp)=>emp.get({plain:true}));

  //use helper function to format the data and output the data
  let emp_table = await employeeTable(empsByMgr);
  let table = cTable.getTable(emp_table)
  console.log(table);
  return true;
}

// function to get and output employees by department
const getEmployeesByDept = async ()=>{
  //first let user select the department
  let getempbydeptmenu = await emp_by_dept_menu();
  let dept_choice = await inquirer.prompt(getempbydeptmenu);
  
  // get the department info for output format later
  const deptObjData = await Department.findByPk(dept_choice.emp_by_dept_menu);
  let deptObj = deptObjData.get({plain:true});

  //get all the roles in that department
  const roleObjData = await Role.findAll({where:{department_id:deptObj.id}});
  const roleObj = roleObjData.map((role)=>role.get({plain:true}));

  //array and object to build and send to our table formatting
  const empArray = [];
  let empRow = {};
  
  //for each role, go get each employee and create object and push to array
  for (const role of roleObj){
    let empObjData = await Employee.findAll({ where:{ role_id: role.id}});
    let empObj = empObjData.map((emp)=>emp.get({plain:true}));
    empObj.forEach((emp)=>{
      
      empRow = {
        id: emp.id,
        first_name: emp.first_name,
        last_name: emp.last_name,
        manager_id: emp.manager_id, 
        role: {
          title: role.title,
          salary: "$"+role.salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          department: {
            name: deptObj.name
          }
        }
      }
      empArray.push(empRow);
      
    })
  }
// get formatted table data from our formatter  
let emp_table = await employeeTable(empArray);
//output formatted table to console
let table = cTable.getTable(emp_table)
console.log(table);
return true;
}

//function to let user create employees
const postEmployee = async ()=>{

  //prompt user with options to create employee
  let addempmenu = await add_emp_menu();
  let emp_obj = await inquirer.prompt(addempmenu);
  //insert new employee to our db
  const newEmp = await Employee.create({
    ...emp_obj
  });
  // reprint the new table to console
  await getEmployees();
  return newEmp;
}

// function to let user update all employee information
const updateEmployee = async ()=>{

  //first, get the employee that we're updating
  let emp_choice_menu = await get_emp_to_update_menu();
  let emp_choice = await inquirer.prompt(emp_choice_menu);
  let emp_id = emp_choice.emp_to_update;
  
  // next, send that id to the menu function to get a custom menu to update the employee
  let emp_update_menu = await update_emp_menu(emp_id);
  let emp_data = await inquirer.prompt(emp_update_menu);

  // build object from user input
  emp_obj = {
    first_name: emp_data.first_name,
    last_name: emp_data.last_name,
    role_id: emp_data.role_id,
    manager_id: emp_data.manager_id,
  }
  
  // update the database with our new employee data
  const putEmp = await Employee.update(
    {...emp_obj},
    {where:{id:emp_id}});

  // output the new employee table to console
  await getEmployees();
  return putEmp;

}

// function for user to select and delete an employee.  Prompts for confirmation after selection.
const deleteEmployee = async ()=>{
  // present user with available employees to delete
  let emp_choice_menu = await get_emp_to_update_menu();
  let emp_choice = await inquirer.prompt(emp_choice_menu);
  let emp_id = emp_choice.emp_to_update;

  // let user confirm that they want to delete employee
  let emp_del_conf_menu = await delete_emp_menu(emp_id);
  let emp_del_conf = await inquirer.prompt(emp_del_conf_menu)

  // if they confirm and they're not trying to delete our Unassigned placeholder, then:
  if ((emp_del_conf.del_emp)&&(emp_id != 1)){
    // first set every employee to 1-Unassigned for manager_id where
    let update_employee_mgrs = await Employee.update({manager_id:1}, {where: { manager_id:emp_id}})

    // now delete the employee
    let deleted_emp = await Employee.destroy({
      where: {id:emp_id}
    })
  }

  //output the new employee table to console
  await getEmployees();
  return emp_del_conf.del_emp;

}

module.exports = employeeFunctions;