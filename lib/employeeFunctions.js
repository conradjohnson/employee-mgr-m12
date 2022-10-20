const inquirer = require('inquirer');
const  {add_emp_menu, emp_by_mgr_menu, emp_by_dept_menu, get_emp_to_update_menu, update_emp_menu, delete_emp_menu}  = require('./menus');
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
        reply = await updateEmployee();
        break;
      case 'del_emp':
        reply = await deleteEmployee();
        break;
      case 'back':
        console.log('going back');
        reply = 'back';
        break;  
    }
    return reply;
  };

const deleteEmployee = async ()=>{
  let emp_choice_menu = await get_emp_to_update_menu();
  let emp_choice = await inquirer.prompt(emp_choice_menu);
  let emp_id = emp_choice.emp_to_update;

  let emp_del_conf_menu = await delete_emp_menu(emp_id);
  let emp_del_conf = await inquirer.prompt(emp_del_conf_menu)
  if (emp_del_conf.del_emp){
    // first set every employee to 1-Unassigned for manager_id where
    let update_employee_mgrs = await Employee.update({manager_id:1}, {where: { manager_id:emp_id}})

    // now delete the employee
    let deleted_emp = await Employee.destroy({
      where: {id:emp_id}
    })
  }
  await getEmployees();
  return emp_del_conf.del_emp;

}
  
const updateEmployee = async ()=>{
  //first, get the employee that we're updating
  let emp_choice_menu = await get_emp_to_update_menu();
  let emp_choice = await inquirer.prompt(emp_choice_menu);
  let emp_id = emp_choice.emp_to_update;
  
  // next, send that id to the menu function to get a custom menu to update the employee
  //start here - need to update update_emp_menu functi
  let emp_update_menu = await update_emp_menu(emp_id);
  let emp_data = await inquirer.prompt(emp_update_menu);

  emp_obj = {
    first_name: emp_data.first_name,
    last_name: emp_data.last_name,
    role_id: emp_data.role_id,
    manager_id: emp_data.manager_id,
  }
  console.log(emp_obj);
  const putEmp = await Employee.update(
    {...emp_obj},
    {where:{id:emp_id}});
  await getEmployees();
  return putEmp;

}

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
      row.salary = "$"+employee.role.salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
          salary: "$"+role.salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
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