const express = require('express')
const app = express()
const mysql = require('mysql')
const fs = require('fs')


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'password',
    database: 'employee_database'
});


connection.connect((err) => {
    if (err) throw err;
    console.log(`Connected as ID: ${connection.threadId}.`);
    createTables()
})


const createTables = () => {
    connection.query(`
    CREATE TABLE employee(
        id int AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(30),
        last_name VARCHAR(30),
        role_id INT,
        manager_id INT
    );`, (err, res) => {
        
            if (err) throw err;
        console.log(`(employee) table created!`);
    })

    connection.query(`
    CREATE TABLE role(
        id int AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(30),
        salary DECIMAL,
        department_id INT
    );`, (err, res) => {
        
            if (err) throw err;
        console.log(`(role) table created!`);
    })

    connection.query(`
    CREATE TABLE department(
        id int AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(30)
    );`, (err, res) => {
        
            if (err) throw err;
        console.log(`(department) table created!`);
        connection.end()
    })
}

