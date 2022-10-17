const inquirer = require('inquirer');
const  {main_menu, emp_menu}  = require('./lib/menus');
const header = require('./lib/header');
const greeting = require('./lib/greeting');
const exit_message = require('./lib/exit_message');
const employeeFunctions = require('./lib/employeeFunctions');

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
            await startEmployeeMenu()
            .then(async emp_menu_ans=>{
              console.log("empmenu:" + emp_menu_ans.emp_menu);
              await employeeFunctions(emp_menu_ans.emp_menu)
              .then(async emp_reply =>{
                 if (emp_reply === 'back'){
                   emp_menu_loop = false;
                 }})
            })

           // while(emp_menu_loop){
              
              
             
             // })
              // if (emp_reply != "back"){
              //   console.log('here')
              //   emp_reply = await employeeFunctions(emp_menu_action);
              // }
              //  do{

              //    emp_reply = await employeeFunctions(emp_menu_action);
              //  } while (emp_reply!='back');

              // console.log("!!!!!!!!!!!!!!")
              // console.log("emp_reply: " + emp_reply);
          //  }
        }

          // If user selected a Role Function
          if (answers.role_menu){
            console.log("Role Functions");
          }

          // If user selected a Department Function
          if (answers.dept_menu){
            console.log("Dept functions");
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