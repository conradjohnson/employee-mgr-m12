const inquirer = require('inquirer');
const questions = require('./lib/questions');
const header = require('./lib/header');
const greeting = require('./lib/greeting');


const showMenu = () => {
    return inquirer.prompt(questions);
}

const main = async () => {
   // console.log(greeting);
    console.log(header());
    while (true) {
      await showMenu()
      .then(answers => {
       
    })
  }};

main();