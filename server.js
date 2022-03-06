const fs = require('fs');
const index = require('./index.js')

const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    password: '',
    database: 'organization_db'
  },
  console.log(`Connected to the organization_db database.`)
);

/* View all employees: employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to */
app.get('/api/employees', (req, res) => {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary, employee.manager_id
    FROM employee
    LEFT JOIN employee
    ON employee.role_id = role.id
    LEFT JOIN role
    ON role.department_id = department.id
    ORDER BY employee.id;`;
    
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
         return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
  });

// Add an employee
app.post('/api/new-employee', ({ body }, res) => {
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
      VALUES (?)`;
    const params = [body.empFirstName, body.empLastName, body.empRole, body.empMgr];
    
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: body
      });
    });
  });

// Update employee's role
app.put('/api/employees/:id', (req, res) => {
    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
    const params = [req.body.empToUpdate, req.params.newEmpRole];
  
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
      } else if (!result.affectedRows) {
        res.json({
          message: 'Employee not found'
        });
      } else {
        res.json({
          message: 'success',
          data: req.body,
          changes: result.affectedRows
        });
      }
    });
  });

// View all roles.
app.get('/api/roles', (req, res) => {
    const sql = `SELECT role.title, role.id, department.name, role.salary
    FROM role
    LEFT JOIN role
    ON role.department_id = department.id;
    ORDER BY role.id;`;
    
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
         return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
  });

// Add a role.
app.post('/api/new-role', ({ body }, res) => {
    const sql = `INSERT INTO role (title, salary, department_id)
      VALUES (?)`;
    const params = [body.newRole, body.newRoleSalary, body.newRoleDept];
    
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: body
      });
    });
  });

// View all departments.
app.get('/api/departments', (req, res) => {
    const sql = `SELECT department.department_name, department_id
    FROM department
    ORDER BY department_id;`;
    
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
         return;
      }
      res.json({
        message: 'success',
        data: rows
      });
    });
  });

// Add a department.
app.post('/api/new-department', ({ body }, res) => {
    const sql = `INSERT INTO department (department_name)
      VALUES (?)`;
    const params = [body.newDepartment];
    
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: body
      });
    });
  });










