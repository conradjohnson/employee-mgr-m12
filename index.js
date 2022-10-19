const inquirer = require('inquirer');
const  {main_menu, emp_menu, role_menu, dept_menu}  = require('./lib/menus');
const header = require('./lib/header');
const greeting = require('./lib/greeting');
const exit_message = require('./lib/exit_message');
const employeeFunctions = require('./lib/employeeFunctions');
const roleFunctions = require('./lib/roleFunctions');
const deptFunctions = require('./lib/deptFunctions');

const startMainMenu = async () => {
    const answer = await inquirer.prompt(main_menu);
    console.log(answer)
    return answer;
}
const startEmployeeMenu = async () => {
  const answer = await inquirer.prompt(emp_menu);
  console.log(answer)
  return answer;
}
const startRoleMenu = async () => {
  const answer = await inquirer.prompt(role_menu);
  console.log(answer)
  return answer;
}
const startDeptMenu = async () => {
  const answer = await inquirer.prompt(dept_menu);
  console.log(answer)
  return answer;
}



const main = async () => {
    let loop = true;
   // console.log(greeting);
   console.log(header());
   let current_sub;
   let back_btn;
   
   while (loop) {
      
      await startMainMenu()
      .then(async answers => {
        
        // Top level menu options back from main_menu
          // that means we want some function to call in either one of the sub menus.
          console.log("HERE's some action!");
          
          // If we've selected some Employee Function, then let's go to that function.
          if (answers.main_menu === 'menu_emp'){
            console.log("Employee function");
            let emp_menu_loop = true;
            while(emp_menu_loop){
              await startEmployeeMenu()
              .then(async emp_menu_ans=>{
                console.log("empmenu:" + emp_menu_ans.emp_menu);
                await employeeFunctions(emp_menu_ans.emp_menu)
                .then(async emp_reply =>{
                  if (emp_reply === 'back'){
                    emp_menu_loop = false;
                  }})
              })
            }
          }

          // If user selected a Role Function
          if (answers.main_menu === 'menu_role'){
            console.log("HR/Role Functions");
            
            let role_menu_loop = true;
            while(role_menu_loop){
              await startRoleMenu()
              .then(async role_menu_ans=>{
                console.log("rolemenu:" + role_menu_ans.role_menu);
                await roleFunctions(role_menu_ans.role_menu)
                .then(async role_reply =>{
                  if (role_reply === 'back'){
                    role_menu_loop = false;
                  }})
              })
            }
          }

          // If user selected a Department Function
          if (answers.main_menu === 'menu_dept'){
            console.log("Department Functions");
            
            let dept_menu_loop = true;
            while(dept_menu_loop){
              await startDeptMenu()
              .then(async dept_menu_ans=>{
                console.log("rolemenu:" + dept_menu_ans.dept_menu);
                await deptFunctions(dept_menu_ans.dept_menu)
                .then(async dept_reply =>{
                  if (dept_reply === 'back'){
                    dept_menu_loop = false;
                  }})
              })
            }
          }

        
       
       // Exit Employee Manager (close program)
       if (answers.main_menu === 'exit'){
        loop = false;
       }
    })
  }
  // show exit greeting
  console.log(exit_message());

};

main();