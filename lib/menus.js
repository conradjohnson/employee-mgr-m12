//Static and dynamic menu building

const sequelize = require('../config/connection');
const { Department, Role, Employee } = require('../models');

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
    },
    {
        type: 'list',
        name: 'emp_menu',
        message: 'Employee Functions',
        when: (answers) => answers.main_menu === 'menu_emp',
        choices: [
            {value: 'get_emp', name: "View All Employees"},
            {value: 'get_emp_mgr', name: "View Staff by Manager"},
            {value: 'get_emp_dept', name: "View Staff by Department"},
            {value: 'post_emp', name: "Add New Employee"},
            {value: 'put_emp', name: "Update Employee"},
            {value: 'del_emp', name: "Remove Employee"},
            {value: 'back', name: "Back"},
        ]
     },
    //  {
    //     type: 'list',
    //     name: 'role_menu',
    //     message: 'HR Roles Functions',
    //     when: (answers) => answers.main_menu === 'menu_role',
    //     choices: [
    //         {value: 'get_role', name: "View All Roles"},
    //         {value: 'post_role', name: "Create New Role"},
    //         {value: 'del_role', name: "Remove Role"},
    //         {value: 'back', name: "Back"},
    //     ]
    //  },
     {
        type: 'list',
        name: 'dept_menu',
        message: 'Department Functions',
        when: (answers) => answers.main_menu === 'menu_dept',
        choices: [
            {value: 'post_dept', name: "Add New Department"},
            {value: 'del_dept', name: "Remove Department"},
            {value: 'back', name: "Back"},
        ]
     },


];
// call from js for getting answers to questions.
//answers = await inquirer.prompt(questions);

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
module.exports = { main_menu, emp_menu, add_emp_menu };