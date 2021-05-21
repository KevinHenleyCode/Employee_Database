const inquirer = require('inquirer')




const qStart = () => {
    
    inquirer.prompt([
        {
            type: 'list',
            name: 'mainMenu',
            message: 'How may I help you?',
            choices: ['Add Info', 'Delete Info', 'View Info']
        },
        {
            type: 'input',
            name: 'next',
            message: 'What can I do next?'
        }
    ])
    .then((userInput) => {

        // const readmeDoc = readmeContent(userInput);

        licenseChoice(userInput)

        // fs.writeFile('README.md', readmeDoc, (error) =>
        //     error ? console.log(error) : console.log('Your README file is ready!'));
    });

    function licenseChoice(userInput) {

        switch (userInput.license) {
            case 'AGPL v3':
                return '[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)'
                break;

            case 'GPL v3':
                return '[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)'
                break;

            default:
                break;
        }
    }
}

module.exports.qStart = qStart;