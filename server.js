const express = require('express')
const app = express()
const mysql = require('mysql')
const fs = require('fs')
const inquirer = require('inquirer')
const { userInfo } = require('os')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'password',
    database: 'employee_database'
});


connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as ID: ${connection.threadId}.\n`);
    createDatabase()
})


const createDatabase = () => {
    connection.query(`
    CREATE DATABASE IF NOT EXISTS employee_database;
    `, (err, res) => {

        if (err) throw err;
    })
    
    console.log(`Created employee_database.\n`);
    createTables()
}




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
        FOREIGN KEY(department_id) REFERENCES department(id)
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
        FOREIGN KEY(role_id) REFERENCES role(id),
        FOREIGN KEY(manager_id) REFERENCES employee(id)
    );`, (err, res) => {
        
            if (err) throw err;
    })

        console.log(`Tables created!\n`);
        qStart()
}

    
const qStart = () => {

    inquirer.prompt([
        {
            type: 'list',
            name: 'mainMenu',
            message: 'How may I help you?',
            choices: ['Add Info', 'Delete Info', 'View Info', 'Exit']
        }
    ])
    .then((userInput) => {
        switch (userInput.mainMenu) {
            case 'Add Info':
                console.log(`Okay let's Add some info!!`);
                qAdd()
                break;
            case 'Delete Info':
                console.log(`Okay let's Delete some info!!`);
                qDelete()
                break;
            case 'View Info':
                console.log(`Okay let's View some info!!`);
                qView()
                break;
            default:
                console.log('See you next time!!');
                connection.end();
                break;
        }
    });
}


const qAdd = () => {

    inquirer.prompt([
        {
            type: 'list',
            name: 'add',
            message: 'What would you like to add?',
            choices: ['Department', 'Role', 'Employee']
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
            }
        });
}

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
    ])
        .then((roleData) => {
            connection.query(`
            INSERT INTO role(title, salary)
            VALUES ('${roleData.roleTitle}', ${roleData.roleSalary});
            `, (err, res) => {

                if (err) throw err;
            })

            qStart()
        });
}

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
            message: 'Enter the the role id.'
        },
        {
            type: 'input',
            name: 'managerCheck',
            message: 'Are they a manager? Type 1(Yes) 0(No)'
        },
    ])
        .then((employeeData) => {

            connection.query(`
            INSERT INTO employee(first_name, last_name, role_id, manager_id)
            VALUES ('${employeeData.firstName}', '${employeeData.lastName}', '${employeeData.roleID}', '${employeeData.managerCheck}');
            `, (err, res) => {

                if (err) throw err;
            })

            qStart()
        });
}










const qDelete = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'add',
            message: 'What would you like to delete?',
            choices: ['Department', 'Role', 'Employee']
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
            }
        });
}

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








const qView = () => {
        
    console.log(`Ready to view some info??`);
}
