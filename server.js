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
    CREATE TABLE IF NOT EXISTS employee(
        id int AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(30),
        last_name VARCHAR(30),
        role_id INT,
        manager_id INT
    );`, (err, res) => {
        
            if (err) throw err;
    })

    connection.query(`
    CREATE TABLE IF NOT EXISTS role(
        id int AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(30),
        salary DECIMAL,
        department_id INT
    );`, (err, res) => {
        
            if (err) throw err;
    })

    connection.query(`
    CREATE TABLE IF NOT EXISTS department(
        id int AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(30)
    );`, (err, res) => {
        
            if (err) throw err;
        })
        
        console.log(`Tables created!\n`);
        qStart()
        connection.end()
}

    
const qStart = () => {

    inquirer.prompt([
        {
            type: 'list',
            name: 'mainMenu',
            message: 'How may I help you?',
            choices: ['Add Info', 'Delete Info', 'View Info', 'Exit']
        },
        {
            type: 'input',
            name: 'next',
            message: 'What can I do next?'
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
                break;
        }
    });
}




    
const qAdd = () => {
        
    console.log(`Ready to add some info??`);

    inquirer.prompt([
        {
            type: 'list',
            name: 'add',
            message: 'What would you like to add?',
            choices: ['Department', 'Role', 'Employee']
        },
        {
            type: 'input',
            name: 'next',
            message: 'What can I do next?'
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
    
}
const addRole = () => {

}
const addEmployee = () => {

}










const qDelete = () => {
        
    console.log(`Ready to delete some info??`);
}
const qView = () => {
        
    console.log(`Ready to view some info??`);
}
