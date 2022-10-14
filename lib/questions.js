const questions = [
    {
        type: 'list',
        name: 'license',
        message: 'Which Software License?',
        choices: [
            {value: 'MIT', name: "MIT"},
            {value: 'GAGPL', name: "GNU AGPLv3"},
            {value: 'GGPL', name: "GNU GPLv3"},
            {value: 'MOZ', name: "Mozilla v2"},
            {value: 'APA', name: "Apache v2"},
            {value: 'ISC', name: "Internet Systems Consortium (ISC)"},
            {value: 'UNL', name: "The Unlicense"},
            {value: 'NO', name: "None"}
          ]
        ,
    }];

module.exports = questions;