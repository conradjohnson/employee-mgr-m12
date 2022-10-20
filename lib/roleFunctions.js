const inquirer = require('inquirer');
const  { add_role_menu, get_role_to_delete_menu, delete_role_menu}  = require('./menus');
const sequelize = require('../config/connection');
const { Department, Role, Employee } = require('../models');


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

const getRoles = async ()=>{
  
    //const answer = await inquirer.prompt(add_emp_menu);
    const roleListData = await Role.findAll({
      include:  Department
    });
    
      
  
  const roleList = roleListData.map((role)=> role.get({plain: true}));
    
    //tabelize the results
    roleTable = await rolesTable(roleList);
    
    
    console.table(roleTable);
    return true;
  }

const postRole = async ()=>{
    let addrolemenu = await add_role_menu();
    let role_obj = await inquirer.prompt(addrolemenu);
    
    const newRole = await Role.create({
      ...role_obj
    });
    await getRoles();
    return newRole;
  }
  
const deleteRole = async ()=>{
    let role_choice_menu = await get_role_to_delete_menu();
    let role_choice = await inquirer.prompt(role_choice_menu);
    let role_id = role_choice.role_to_delete;

    let role_del_conf_menu = await delete_role_menu(role_id);
    let role_del_conf = await inquirer.prompt(role_del_conf_menu);
    if ((role_del_conf.del_role) && (role_id != 1)){
        // first set roles in Employees to 1-Unassigned so that we don't delete the employees
        let update_employee_roles = await Employee.update({role_id:1}, {where: { role_id:role_id}});

        let deleted_role = Role.destroy({
            where: {id:role_id}
        })

    }
    await getRoles();
    return role_del_conf.del_role;
    
  }


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


module.exports = roleFunctions;