const inquirer = require('inquirer');
const  { add_role_menu, get_role_to_delete_menu, delete_role_menu}  = require('./menus');
const sequelize = require('../config/connection');
const { Department, Role, Employee } = require('../models');

// main function that catches all actions from HR Roles Menu
// based on the role menu selection, will perform function
const roleFunctions = async (menu_command) =>{
    let reply = 'no action';
    switch(menu_command) {
      case 'get_role':
        reply = await getRoles();
        break;
      case 'post_role':
        reply = await postRole();
        break;
      case 'del_role':
        reply = await deleteRole();
        break;
      case 'back':
        console.log('going back');
        reply = 'back';
        break;  
    }
    return reply;
};

//helper function to format table output for console.table
const rolesTable = async(roleList)=>{
    let role_table = await Promise.all(roleList.map(async (role)=> {
       const row = {}
       row.id = role.id;
       row.title = role.title;
       row.salary = "$"+role.salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
       row.deptartment = role.department.name;
       return row;
   }));
   return role_table
}

// function to output all roles to console
const getRoles = async ()=>{
    //get all roles
    const roleListData = await Role.findAll({
        include:  Department
    });    
    const roleList = roleListData.map((role)=> role.get({plain: true}));
    
    //tabelize the results
    roleTable = await rolesTable(roleList);
    //output to console    
    console.table(roleTable);
    return true;
  }

// function to let user create new role.
const postRole = async ()=>{
    // will prompt user with department options, salary and title
    let addrolemenu = await add_role_menu();
    let role_obj = await inquirer.prompt(addrolemenu);
    // create the new role
    const newRole = await Role.create({
      ...role_obj
    });
    //output new roles table to console.
    await getRoles();
    return newRole;
  }

//function to let user delete role
const deleteRole = async ()=>{
    // get role that user wants to delete
    let role_choice_menu = await get_role_to_delete_menu();
    let role_choice = await inquirer.prompt(role_choice_menu);
    let role_id = role_choice.role_to_delete;

    //let user confirm that they want to delete role
    let role_del_conf_menu = await delete_role_menu(role_id);
    let role_del_conf = await inquirer.prompt(role_del_conf_menu);
    // if user confirms and we're not trying to delete our Unassigned placeholder
    if ((role_del_conf.del_role) && (role_id != 1)){
        // first set roles in Employees to 1-Unassigned so that we don't delete the employees
        let update_employee_roles = await Employee.update({role_id:1}, {where: { role_id:role_id}});
        // delete the role from our database
        let deleted_role = await Role.destroy({
            where: {id:role_id}
        })
    }

    //output new roles table to console
    await getRoles();
    return role_del_conf.del_role;
    
  }


module.exports = roleFunctions;