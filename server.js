const express = require('express')
const app = express()
const mysql = require('mysql')
const fs = require('fs')
const inquirer = require('inquirer')
const consoleTable = require('console.table')
const { userInfo } = require('os')


// creates a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'password',
    database: 'employee_database'
});


// lets the user know that they are connected
connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as ID: ${connection.threadId}.\n`);
    createDatabase()
})


// creates the database
const createDatabase = () => {
    connection.query(`
    CREATE DATABASE IF NOT EXISTS employee_database;
    `, (err, res) => {

        if (err) throw err;
    })
    
    console.log(`Created employee_database.\n`);
    createTables()
}


// checks to see if the tables are made, if not then it creates them
const createTables = () => {

    connection.query(`
    CREATE TABLE IF NOT EXISTS department(
        id int AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(30)
    );`, (err, res) => {

        if (err) throw err;
    })

    connection.query(`
    CREATE TABLE IF NOT EXISTS role(
        id int AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(30),
        salary DECIMAL,
        department_id INT,
        FOREIGN KEY (department_id) REFERENCES department(id)

    );`, (err, res) => {

        if (err) throw err;
    })

    connection.query(`
    CREATE TABLE IF NOT EXISTS employee(
        id int AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(30),
        last_name VARCHAR(30),
        role_id INT,
        manager_id INT, 
        FOREIGN KEY (role_id) REFERENCES role(id),
        FOREIGN KEY (manager_id) REFERENCES department(id)
    );`, (err, res) => {
        
            if (err) throw err;
    })

        console.log(`Tables created!\n`);
        qStart()
}


// creates the main menu for the user
const qStart = () => {

    inquirer.prompt([
        {
            type: 'list',
            name: 'mainMenu',
            message: 'How may I help you?',
            choices: ['Add Info', 'Delete Info', 'View Info', 'Exit\n']
        }
    ])
    .then((userInput) => {
        switch (userInput.mainMenu) {
            case 'Add Info':
                qAdd()
                break;
            case 'Delete Info':
                qDelete()
                break;
            case 'View Info':
                qView()
                break;
            default:
                console.log('See you next time!!');
                connection.end();
                break;
        }
    });
}




// handles all of the add prompts_______________________________________
const qAdd = () => {

    inquirer.prompt([
        {
            type: 'list',
            name: 'add',
            message: 'What would you like to add?',
            choices: ['Department', 'Role', 'Employee', 'Main Menu\n']
        }
    ])
        .then((addData) => {
            switch (addData.add) {
                case 'Department':
                    addDepartment()
                    break;
                case 'Role':
                    addRole()
                    break;
                case 'Employee':
                    addEmployee()
                    break;
                case 'Main Menu\n':
                    qStart()
                    break;
            }
        });
}

// adds a department
const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'depName',
            message: 'Type the name of the new department.'
        }
    ])
    .then((depData) => {
        connection.query(`
            INSERT INTO department(name)
            VALUES ('${depData.depName}');
            `, (err, res) => {

                if (err) throw err;
        })

        qStart()
    });  
}

// adds a role
const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message: 'Enter the title of this role.'
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: "What's the salary?"
        },
        {
            type: 'input',
            name: 'roleDep',
            message: "Enter your department id."
        },
    ])
        .then((roleData) => {
            connection.query(`
            INSERT INTO role(title, salary, department_id)
            VALUES ('${roleData.roleTitle}', ${roleData.roleSalary}, ${roleData.roleDep});
            `, (err, res) => {

                if (err) throw err;
            })

            qStart()
        });
}

// adds an employee
const addEmployee = () => {

    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'Please enter the first name.'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'And the last name.'
        },
        {
            type: 'input',
            name: 'roleID',
            message: 'Add role ID.'
        }
    ])
        .then((employeeData) => {

            connection.query(`
            INSERT INTO employee(first_name, last_name, role_id)
            VALUES ('${employeeData.firstName}', '${employeeData.lastName}', ${employeeData.roleID});
            `, (err, res) => {

                if (err) throw err;
            })

            qStart()
        });
}




// handles all of the delete prompts_____________________________________
const qDelete = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'add',
            message: 'What would you like to delete?',
            choices: ['Department', 'Role', 'Employee', 'Main Menu\n']
        }
    ])
        .then((addData) => {
            switch (addData.add) {
                case 'Department':
                    deleteDepartment()
                    break;
                case 'Role':
                    deleteRole()
                    break;
                case 'Employee':
                    deleteEmployee()
                    break;
                case 'Main Menu\n':
                    qStart()
                    break;
            }
        });
}

// deletes a department
const deleteDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'depName',
            message: "Type the Name of the department you'd like to delete."
        }
    ])
        .then((depData) => {
            connection.query(`
            DELETE FROM department
            WHERE name = '${depData.depName}';
            `, (err, res) => {

                if (err) throw err;
            })

            qStart()
        });
}

// deletes a role
const deleteRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message: "Type the Title of the role you'd like to delete."
        }
    ])
        .then((roleData) => {
            connection.query(`
            DELETE FROM role
            WHERE title = '${roleData.roleTitle}';
            `, (err, res) => {

                if (err) throw err;
            })

            qStart()
        });
}

// deletes an employee
const deleteEmployee = () => {

    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: "Type the first name of the role you'd like to delete."
        }
    ])
        .then((employeeData) => {
            connection.query(`
            DELETE FROM employee
            WHERE first_name = '${employeeData.firstName}';
            `, (err, res) => {

                if (err) throw err;
            })

            qStart()
        });
}



// handles all of the view prompts_____________________________________
const qView = () => {

    inquirer.prompt([
        {
            type: 'list',
            name: 'add',
            message: 'What would you like to delete?',
            choices: ['Department', 'Role', 'Employee', 'All Departments', 'All Roles', 'All Employees', 'All Data', 'Main Menu\n']
        }
    ])
        .then((addData) => {
            switch (addData.add) {
                case 'Department':
                    viewDepartment()
                    break;
                case 'Role':
                    viewRole()
                    break;
                case 'Employee':
                    viewEmployee()
                    break;
                case 'All Departments':
                    viewAllDeps()
                    break;
                case 'All Roles':
                    viewAllRoles()
                    break;
                case 'All Employees':
                    viewAllEms()
                    break;
                case 'All Data':
                    viewAll()
                    break;
                case 'Main Menu\n':
                    qStart()
                    break;
            }
        });
}

// views a specific department
const viewDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'depName',
            message: "Enter department name."
        }
    ])
        .then((depData) => {
            connection.query(`
            SELECT * FROM department WHERE name = '${depData.depName}';
            `, (err, res) => {

                if (err) throw err;
                console.table(`\n`);
                console.table(res);
            })
            // console.log(test.firstName)

            qStart()
        });
}

// views a specific role
const viewRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleTitle',
            message: "Enter role title."
        }
    ])
        .then((roleData) => {
            connection.query(`
            SELECT * FROM role WHERE title = '${roleData.roleTitle}';
            `, (err, res) => {

                if (err) throw err;
                console.table(`\n`);
                console.table(res);
            })
            // console.log(test.firstName)

            qStart()
        });
}

// views a specific employee
const viewEmployee = () => {

    inquirer.prompt([
        {
            type: 'input',
            name: 'employeeName',
            message: "Enter first name."
        }
    ])
        .then((employeeData) => {
            connection.query(`
            SELECT * FROM employee WHERE first_name = '${employeeData.employeeName}';
            `, (err, res) => {

                if (err) throw err;
                console.table(`\n`);
                console.table(res);
            })
            // console.log(test.firstName)

            qStart()
        });
}

// views all departments
const viewAllDeps = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'dep',
            message: "Select (View Table)",
            choices: ['View Table']
        }
    ])
        .then((depData) => {
            connection.query(`
            SELECT * FROM department;
            `, (err, res) => {

                if (err) throw err;
                console.table(`\n`);
                console.table(res);
            })

            qStart()
        });
}

// views all roles
const viewAllRoles = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: "Select (View Table)",
            choices: ['View Table']
        }
    ])
        .then((roleData) => {
            connection.query(`
            SELECT * FROM role;
            `, (err, res) => {

                if (err) throw err;
                console.table(`\n`);
                console.table(res);
            })

            qStart()
        });
}

// views all employees
const viewAllEms = () => {

    inquirer.prompt([
        {
            type: 'list',
            name: 'ems',
            message: "Select (View Table)",
            choices: ['View Table']
        }
    ])
        .then((emsData) => {
            connection.query(`
            SELECT
            employee.first_name,
            employee.last_name,
            role.title,
            role.salary
            FROM employee
            INNER JOIN role
            ON role_id = role.id
            ;
            `, (err, res) => {

                if (err) throw err;
                console.table(`\n`);
                console.table(res);
            })

            qStart()
        });
}

// views all tables
const viewAll = () => {

    inquirer.prompt([
        {
            type: 'list',
            name: 'all',
            message: "Select (View Table)",
            choices: ['View Table']
        }
    ])
        .then((allData) => {
            connection.query(`
            SELECT
            employee.first_name,
            employee.last_name,
            role.title,
            role.salary,
            department.name
            FROM employee
            INNER JOIN role
            ON role_id = role.id
            INNER JOIN department
            ON role_id = department.id
            ;
            `, (err, res) => {

                if (err) throw err;
                console.table(`\n`);
                console.table(res);
            })

            qStart()
        });
}