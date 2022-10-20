//Static and dynamic menu building

const sequelize = require('../config/connection');
const { Department, Role, Employee } = require('../models');

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

const dept_menu = [
    {
        type: 'list',
        name: 'dept_menu',
        message: 'Department Functions',
        choices: [
            {value: 'get_dept', name: "View All Departments"},
            {value: 'post_dept', name: "Add New Department"},
            {value: 'del_dept', name: "Remove Department"},
            {value: 'back', name: "Back"},
        ]
     }
];

const emp_by_mgr_menu = async()=>{
    const mgrIDsData = await Employee.findAll({
        attributes: [
            // specify an array where the first element is the SQL function and the second is the alias
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
    let mgrlistmenu =[{
        type: 'list',
        name: 'emp_by_mgr_menu',
        message: 'Select a Manager to View Employees',
        choices: [
        ]
    }
    ]

    for (i=0; i< mgrs.length; i++){
        let menuitem = { 
            value: mgrs[i].id, name:`${mgrs[i].first_name} ${mgrs[i].last_name} - ${mgrs[i].role.title}` }
        mgrlistmenu[0].choices.push(menuitem);
    }
    console.log(mgrlistmenu);
    return(mgrlistmenu);
}

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

const get_dept_to_delete_menu = async () =>{
    let deldeptmenu = [
        {
            type: 'list',
            message: 'Select Department: ',
            name: 'dept_to_delete',
            choices: departmentNames,
        },]

    return deldeptmenu;
}

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
    get_dept_to_delete_menu,
    delete_dept_menu };