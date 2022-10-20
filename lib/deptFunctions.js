const inquirer = require('inquirer');
const  {add_dept_menu, get_dept_to_delete_menu, delete_dept_menu}  = require('./menus');
const sequelize = require('../config/connection');
const { Department, Role, Employee } = require('../models');


const deptFunctions = async (menu_command) =>{
    let reply = 'no action';
    switch(menu_command) {
      case 'get_dept':
        reply = await getDepartments();
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

const getDepartments = async ()=>{

//const answer = await inquirer.prompt(add_emp_menu);
const deptListData = await Department.findAll();
const deptList = deptListData.map((dept)=> dept.get({plain: true}));

//tabelize the results
deptTable = await deptsTable(deptList);

console.table(deptTable);
return true;
}

const postDepartment = async ()=>{
    let adddeptmenu = await add_dept_menu();
    let dept_obj = await inquirer.prompt(adddeptmenu);
    
    const newDept = await Department.create({
        ...dept_obj
    });
    await getDepartments();
    return newDept;
      
}
const deleteDepartment = async ()=>{
    let dept_choice_menu = await get_dept_to_delete_menu();
    let dept_choice = await inquirer.prompt(dept_choice_menu);
    let dept_id = dept_choice.dept_to_delete;

    let dept_del_conf_menu = await delete_dept_menu(dept_id);
    let dept_del_conf = await inquirer.prompt(dept_del_conf_menu);
    if ((dept_del_conf.del_dept) && (dept_id != 1)){
        // first set roles in Employees to 1-Unassigned so that we don't delete the employees
        let update_roles = await Role.update({department_id:1}, {where: { department_id:dept_id}});

        let deleted_dept = Department.destroy({
            where: {id:dept_id}
        })
    }
    await getDepartments();
    return dept_del_conf.del_dept;
    
  }

const deptsTable = async(deptList)=>{
    let dept_table = await Promise.all(deptList.map(async (dept)=> {
        const row = {}
        row.id = dept.id;
        row.name = dept.name;
        return row;
    }));
    return dept_table
}

module.exports = deptFunctions;