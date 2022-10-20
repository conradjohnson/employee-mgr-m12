const inquirer = require('inquirer');
const  {add_dept_menu, get_depts_menu, delete_dept_menu}  = require('./menus');
const sequelize = require('../config/connection');
const { Department, Role, Employee } = require('../models');
const cTable = require('console.table');

// main function that catches all actions from Departments Menu
// based on the department menu selection, will perform function
const deptFunctions = async (menu_command) =>{
    let reply = 'no action';
    switch(menu_command) {
      case 'get_dept':
        reply = await getDepartments();
        break;
    case 'get_dept_money':
            reply = await getDeptBudgets();
            break;
      case 'post_dept':
        reply = await postDepartment();
        break;
      case 'del_dept':
        reply = await deleteDepartment();
            break;
      case 'back':
        reply = 'back';
        break;  
    }
    return reply;
  };


// helper function to format our table output for departments
const deptsTable = async(deptList)=>{
    let dept_table = await Promise.all(deptList.map(async (dept)=> {
        const row = {}
        row.id = dept.id;
        row.name = dept.name;
        return row;
    }));
    return dept_table
}

// prints all current departments to console
const getDepartments = async ()=>{

    //const answer = await inquirer.prompt(add_emp_menu);
    const deptListData = await Department.findAll();
    const deptList = deptListData.map((dept)=> dept.get({plain: true}));

    //tabelize the results
    deptTable = await deptsTable(deptList);
    let table = cTable.getTable(deptTable);
    console.log(table);
    return true;
}

// function to print department budget information
const getDeptBudgets = async ()=>{
    // get department to view budget
    let dept_choice_menu = await get_depts_menu();
    let dept_choice = await inquirer.prompt(dept_choice_menu);
    let dept_id = dept_choice.dept_selected;

    // get department object for our output
    const deptObjData = await Department.findByPk(dept_id);
    const deptObj = deptObjData.get({plain:true});

    //first get all the roles in that department
    const roleBudgetData = await Role.findAll({where: {department_id:dept_id}});
    const rolesArray = roleBudgetData.map((role)=>role.get({plain:true}));
    
    // set our collection variables for output
    let deptBudget = 0;
    let budgetTable = []
    let budgetTableRow = {}

    // for each role, get all employees in that role, build a table Array while summing salary total
    for (const role of rolesArray){
        let empArrayData = await Employee.findAll({where:{role_id:role.id}});
        let empArray = empArrayData.map((emp)=>emp.get({plain:true}));

        for (const emp of empArray){
            budgetTableRow = {
                id: emp.id,
                employee_name: emp.first_name+ " "+ emp.last_name,
                manager_id: emp.manager_id, 
                title: role.title,
                salary: "$"+role.salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                department: deptObj.name
             }
            budgetTable.push(budgetTableRow);
            deptBudget += role.salary;
            
        }
    }
    // build and add our total row
    budgetTableRow = {
        id:"",
        employee_name:"",
        manager_id: "",
        title: "TOTAL BUDGET:",
        salary: "$"+deptBudget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        department: ""
    }
    budgetTable.push(budgetTableRow);

    // output budget table to console
    let table = cTable.getTable(budgetTable);
    console.log(table);
    return true;

}

// function to let user create a new department
const postDepartment = async ()=>{
    // collect new department information
    let adddeptmenu = await add_dept_menu();
    let dept_obj = await inquirer.prompt(adddeptmenu);
    
    // create the new department
    const newDept = await Department.create({
        ...dept_obj
    });
    // output new department table to screen
    await getDepartments();
    return newDept;
      
}

// function that allows user to delete department
const deleteDepartment = async ()=>{
    // prompts user with the department they want to delete
    let dept_choice_menu = await get_depts_menu();
    let dept_choice = await inquirer.prompt(dept_choice_menu);
    let dept_id = dept_choice.dept_selected;

    // lets user confirm that they want to delete that department
    let dept_del_conf_menu = await delete_dept_menu(dept_id);
    let dept_del_conf = await inquirer.prompt(dept_del_conf_menu);

    // if user confirms delete and they're not trying to delete the Unassigned placeholder
    if ((dept_del_conf.del_dept) && (dept_id != 1)){

        // first set roles in Employees to 1-Unassigned so that we don't delete the employees
        let update_roles = await Role.update({department_id:1}, {where: { department_id:dept_id}});

        // delete the department
        let deleted_dept = Department.destroy({
            where: {id:dept_id}
        })
    }
    //output new departments table to console.
    await getDepartments();
    return dept_del_conf.del_dept;
    
  }



module.exports = deptFunctions;