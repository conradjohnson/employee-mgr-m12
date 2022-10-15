const inquirer = require('inquirer');
const  {main_menu}  = require('./lib/menus');
const header = require('./lib/header');
const greeting = require('./lib/greeting');
const exit_message = require('./lib/exit_message');


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
      .then(answers => {
        // Top level menu options back from main_menu
        if (answers.emp_menu === 'get_emp'){
          console.log("HERE's some employee info!");
        }

       if (answers.main_menu === 'exit'){
        loop = false;
       }
    })
  }
  // show exit greeting
  console.log(exit_message());


};

main();