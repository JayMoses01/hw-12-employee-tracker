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
    const sql = `SELECT employees_tb.id, employees_tb.first_name, employees_tb.last_name, roles_tb.title, departments_tb.department_name, roles_tb.salary, employees_tb.manager_id
    FROM employees_tb
    LEFT JOIN roles_tb
    ON employees_tb.role_id = roles_tb.id
    LEFT JOIN departments_tb
    ON roles_tb.department_id = departments_tb.id;`;
    
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
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
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
    const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
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
    const sql = `SELECT roles_tb.title, roles_tb.id, departments_tb.department_name, roles_tb.salary
    FROM roles_tb
    LEFT JOIN departments_tb
    ON roles_tb.department_id = departments_tb.id;`;
    
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
    const sql = `INSERT INTO roles (title, salary, department_id)
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
    const sql = `SELECT departments_tb.department_name, departments_tb.id
    FROM departments_tb;`;
    
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
    const sql = `INSERT INTO departments (department_name)
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










