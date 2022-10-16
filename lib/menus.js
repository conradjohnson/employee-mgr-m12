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
     {
        type: 'list',
        name: 'role_menu',
        message: 'HR Roles Functions',
        when: (answers) => answers.main_menu === 'menu_role',
        choices: [
            {value: 'get_role', name: "View All Roles"},
            {value: 'post_role', name: "Create New Role"},
            {value: 'del_role', name: "Remove Role"},
            {value: 'back', name: "Back"},
        ]
     },
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

const add_emp_menu = [
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
        type: 'input',
        message: 'role id#: ',
        name: 'role_id',
    },
    {
        type: 'input',
        message: 'manager id#: ',
        name: 'manager_id',
    }

]

module.exports = { main_menu, add_emp_menu };