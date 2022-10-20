//Static and dynamic menu building for our inquirer program

const sequelize = require('../config/connection');
const { Department, Role, Employee } = require('../models');

// main menu
const main_menu = [
    {
        type: 'list',
        name: 'main_menu',
        message: 'Main Menu:',
        choices: [
            {name:"--"},
            {value: 'menu_emp', name: "Employee Menu"},
            {name:"----------"},
            {value: 'menu_role', name: "HR Roles Menu"},
            {name:"----------"},
            {value: 'menu_dept', name: "Department Menu"},
            {name: "--"},
            {value: 'exit', name: "Exit"}
          ]
        ,
    }
];

//employee menu
const emp_menu = [
        {
        type: 'list',
        name: 'emp_menu',
        message: 'Employee Functions',
        choices: [
            {value: 'get_emp', name: "View All Employees"},
            {value: 'get_emp_mgr', name: "View Staff by Manager"},
            {value: 'get_emp_dept', name: "View Staff by Department"},
            {value: 'post_emp', name: "Add New Employee"},
            {value: 'put_emp', name: "Update Employee"},
            {value: 'del_emp', name: "Remove Employee"},
            {value: 'back', name: "Back"},
        ]
        }
];

//HR Role menu
const role_menu = [
{
        type: 'list',
        name: 'role_menu',
        message: 'HR Roles Functions',
        choices: [
            {value: 'get_role', name: "View All Roles"},
            {value: 'post_role', name: "Create New Role"},
            {value: 'del_role', name: "Remove Role"},
            {value: 'back', name: "Back"},
        ]
     }
];

//Department Menu
const dept_menu = [
    {
        type: 'list',
        name: 'dept_menu',
        message: 'Department Functions',
        choices: [
            {value: 'get_dept', name: "View All Departments"},
            {value: 'get_dept_money', name: "Department Budget"},
            {value: 'post_dept', name: "Add New Department"},
            {value: 'del_dept', name: "Remove Department"},
            {value: 'back', name: "Back"},
        ]
     }
];

// helper function to get employee lists for menus that need them.
const employeeNames = async()=>{
    const employeeListData = await Employee.findAll();
    const employeeList = employeeListData.map((employee)=> employee.get({plain: true}));
    const employeeNames = employeeList.map((employee)=>{
        let obj = {};
        obj.value = employee.id;
        obj.name = employee.first_name + " " + employee.last_name;
        return obj;
    });
    
    return employeeNames;
}


// dynamically build employees by manager menu
const emp_by_mgr_menu = async()=>{
    // first get all the unique manager ids
    const mgrIDsData = await Employee.findAll({
        attributes: [
            // sequelize .fn function to get only the distinct manager ids
            [sequelize.fn('DISTINCT', sequelize.col('manager_id')) ,'manager_id'],
    
         ]
    });
    const mgrIDs = mgrIDsData.map((mgrIds)=>mgrIds.get({plain:true}));
    
    let mgrs= []
    // build a list of managers
    for (i=0; i<mgrIDs.length; i++){
       let mgrData = await Employee.findByPk(mgrIDs[i].manager_id, {
        include:[{model: Role}]
       });
       let mgr = mgrData.get({ plain:true});
       mgrs.push(mgr);
    }
    // manager list menu 
    let mgrlistmenu =[{
        type: 'list',
        name: 'emp_by_mgr_menu',
        message: 'Select a Manager to View Employees',
        choices: [
        ]
    }
    ]
    // add managers to our list menu
    for (i=0; i< mgrs.length; i++){
        let menuitem = { 
            value: mgrs[i].id, name:`${mgrs[i].first_name} ${mgrs[i].last_name} - ${mgrs[i].role.title}` }
        mgrlistmenu[0].choices.push(menuitem);
    }
    // return list of managers for user to select
    console.log(mgrlistmenu);
    return(mgrlistmenu);
}

// menu to list employees by department
const emp_by_dept_menu = async()=>{
    const deptIDsData = await Department.findAll();
    const deptIDs = deptIDsData.map((deptIds)=>deptIds.get({plain:true}));
    
    let depts= []
    let deptlistmenu =[{
        type: 'list',
        name: 'emp_by_dept_menu',
        message: 'Select a Department to View Employees',
        choices: [
        ]
    }
    ]
    // build a list of departments
    for (i=0; i<deptIDs.length; i++){
       let menuitem = { value: deptIDs[i].id, name: deptIDs[i].name};
       deptlistmenu[0].choices.push(menuitem);
    }
   
    console.log(deptlistmenu);
    return(deptlistmenu);


}
// menu to update employee - first select employee
const get_emp_to_update_menu = async()=>{
    let updateempmenu = [
        {
            type: 'list',
            message: 'Select Employee: ',
            name: 'emp_to_update',
            choices: employeeNames,
        },]

    return updateempmenu;

}

// update employee menu
const update_emp_menu = async(emp_id)=>{
    const employeeData = await Employee.findByPk(emp_id);
    const employee = employeeData.get({plain: true});
 
    let update_emp_menu = [
        {
            type: 'input',
            message: 'First Name: ',
            name: 'first_name',
            default: employee.first_name
        },
        {
            type: 'input',
            message: 'Last Name: ',
            name: 'last_name',
            default: employee.last_name
        },
        {
            type: 'list',
            message: 'Role: ',
            name: 'role_id',
            choices: roleTitles,
        },
        {
            type: 'list',
            name: 'manager_id',
            message: 'Employee Manager:',
            choices: employeeNames,
        },
    ]
    
    return update_emp_menu;
}

// add employee menu
const add_emp_menu = async()=>{
    let addempmenu = [
    {
        type: 'input',
        message: 'First Name: ',
        name: 'first_name',
    },
    {
        type: 'input',
        message: 'Last Name: ',
        name: 'last_name',
    },
    {
        type: 'list',
        message: 'Role: ',
        name: 'role_id',
        choices: roleTitles,
    },
    {
        type: 'list',
        name: 'manager_id',
        message: 'Employee Manager:',
        choices: employeeNames,
     },

    ]
    return addempmenu;
}

// delete employee confirmation menu
const delete_emp_menu = async(emp_id)=>{
    const employeeData = await Employee.findByPk(emp_id);
    const employee = employeeData.get({plain: true});
    let delete_conf_menu = [
        {
            name: 'del_emp',
            type: 'confirm',
            message: `Are you sure you want to remove ${employee.first_name} ${employee.last_name}?`,
        }
    ]
    return delete_conf_menu;
}


//helper function to get role titles
const roleTitles = async()=>{

    const roleTitleData = await Role.findAll();
    const roleList = roleTitleData.map((role)=> role.get({plain: true}));
    const roleTitles = roleList.map((role)=>{
        let obj = {};
        obj.value = role.id;
        obj.name = role.title;
        return obj;
    });
    return roleTitles;
}

// add role menu
const add_role_menu = async()=>{
    
    let addrolemenu = [
    {
        type: 'list',
        name: 'department_id',
        message: 'Select Department:',
        choices: departmentNames,
    },
    {
        type: 'input',
        message: 'Role Title: ',
        name: 'title',
    },
    {
        type: 'number',
        message: 'Salary: ',
        name: 'salary',
    },
    

    ]
    return addrolemenu;
}


// menu to delete role - first select role
const get_role_to_delete_menu = async()=>{
    let delrolemenu = [
        {
            type: 'list',
            message: 'Select Role: ',
            name: 'role_to_delete',
            choices: roleTitles,
        },]

    return delrolemenu;
}



// delete role confirmation menu
const delete_role_menu = async(role_id)=>{
    const roleData = await Role.findByPk(role_id);
    const role = roleData.get({plain: true});
    let delete_conf_menu = [
        {
            name: 'del_role',
            type: 'confirm',
            message: `Are you sure you want to remove role ${role.title}?`,
        }
    ]
    return delete_conf_menu;
}

//helper function to get department names
const departmentNames = async()=>{
    const departmentListData = await Department.findAll();
    const departmentList = departmentListData.map((dept)=> dept.get({plain: true}));
    const departmentNames = departmentList.map((dept)=>{
        let obj = {};
        obj.value = dept.id;
        obj.name = dept.name;
        return obj;
    });
    
    return departmentNames;
}

// menu to select department
const get_depts_menu = async () =>{
    let deldeptmenu = [
        {
            type: 'list',
            message: 'Select Department: ',
            name: 'dept_selected',
            choices: departmentNames,
        },]

    return deldeptmenu;
}
// add department menu
const add_dept_menu = async()=>{
        
    let adddeptmenu = [
 
    {
        type: 'input',
        message: 'Department Name: ',
        name: 'name',
    },
 
    ]
    return adddeptmenu;
}
// delete department confirmation menu
const delete_dept_menu = async(role_id)=>{
    const deptData = await Department.findByPk(role_id);
    const dept = deptData.get({plain: true});
    let delete_conf_menu = [
        {
            name: 'del_dept',
            type: 'confirm',
            message: `Are you sure you want to remove Department: ${dept.name}?`,
        }
    ]
    return delete_conf_menu;
}


//export these bad boys
module.exports = { 
    main_menu, 
    emp_menu, 
    role_menu, 
    dept_menu, 
    add_emp_menu, 
    emp_by_mgr_menu, 
    emp_by_dept_menu,
    get_emp_to_update_menu,
    update_emp_menu,
    delete_emp_menu, 
    add_role_menu,
    get_role_to_delete_menu,
    delete_role_menu,
    add_dept_menu,
    get_depts_menu,
    delete_dept_menu };