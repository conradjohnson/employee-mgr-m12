const inquirer = require('inquirer');
const  {main_menu}  = require('./lib/menus');
const header = require('./lib/header');
const greeting = require('./lib/greeting');
const exit_message = require('./lib/exit_message');
const employeeFunctions = require('./lib/employeeFunctions');

const startMainMenu = async () => {
    const answer = await inquirer.prompt(main_menu);
    console.log(answer)
    return answer;
}



const main = async () => {
    let loop = true;
   // console.log(greeting);
   console.log(header());
   
   while (loop) {
      await startMainMenu()
      .then(async answers => {
        
        // Top level menu options back from main_menu
        if (answers.emp_menu != 'back' && answers.role_menu != 'back' && answers.dept_menu != 'back' ){
          // that means we want some function to call in either one of the sub menus.
          console.log("HERE's some action!");
          
          // If we've selected some Employee Function, then let's go to that function.
          if (answers.emp_menu){
            console.log("Employee function");
            let emp_menu_action = answers.emp_menu;
            let emp_reply = await employeeFunctions(emp_menu_action);
            //console.log(emp_reply);
          }

          // If user selected a Role Function
          if (answers.role_menu){
            console.log("Role Functions");
          }

          // If user selected a Department Function
          if (answers.dept_menu){
            console.log("Dept functions");
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