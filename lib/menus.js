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

const add_emp_menu = async()=>{
    const employeeListData = await Employee.findAll();
    const employeeList = employeeListData.map((employee)=> employee.get({plain: true}));
    const employeeNames = employeeList.map((employee)=>{
        let obj = {};
        obj.value = employee.id;
        obj.name = employee.first_name + " " + employee.last_name;
        return obj;
    });
    const roleTitleData = await Role.findAll();
    const roleList = roleTitleData.map((role)=> role.get({plain: true}));
    const roleTitles = roleList.map((role)=>{
        let obj = {};
        obj.value = role.id;
        obj.name = role.title;
        return obj;
    });
    
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
    const employeeListData = await Employee.findAll();
    const employeeList = employeeListData.map((employee)=> employee.get({plain: true}));
    const employeeNames = employeeList.map((employee)=>{
        let obj = {};
        obj.value = employee.id;
        obj.name = employee.first_name + " " + employee.last_name;
        return obj;
    });

    let updateempmenu = [
        {
            type: 'list',
            message: 'Select Employee to Update: ',
            name: 'emp_to_update',
            choices: employeeNames
        },]
    return updateempmenu;

}

const update_emp_menu = async(emp_id)=>{
    const employeeListData = await Employee.findAll();
    const employeeList = employeeListData.map((employee)=> employee.get({plain: true}));
    const employeeNames = employeeList.map((employee)=>{
        let obj = {};
        obj.value = employee.id;
        obj.name = employee.first_name + " " + employee.last_name;
        return obj;
    });
    const roleTitleData = await Role.findAll();
    const roleList = roleTitleData.map((role)=> role.get({plain: true}));
    const roleTitles = roleList.map((role)=>{
        let obj = {};
        obj.value = role.id;
        obj.name = role.title;
        return obj;
    });
    
    const emp_to_update = await get_emp_to_update()

    let updateempmenu = [
    {
        type: 'list',
        message: 'Select Employee to Update: ',
        name: 'emp_to_update',
        choices: employeeNames
    },]
    // {
    //     type: 'input',
    //     message: 'Last Name: ',
    //     name: 'last_name',
    // },
    // {
    //     type: 'list',
    //     message: 'Role: ',
    //     name: 'role_id',
    //     choices: roleTitles,
    // },
    // {
    //     type: 'list',
    //     name: 'manager_id',
    //     message: 'Employee Manager:',
    //     choices: employeeNames,
    //  },

    
    return updateempmenu;
}

const get_emp_to_update = async()=>{

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
    update_emp_menu };