const inquirer = require('inquirer');
//const fs = require('fs'); // Can probably remove this one.
//const Department = require('./lib/Department')
//const Employee = require('./lib/Employee')
//const Role = require('./lib/Role')
const cTable = require('console.table');

// Requiring mysql2.
const mysql = require('mysql2');

// Setting up the connection to the organization database.
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'JMSuccess2022!',
    database: 'organization_db'
  },
  console.log(`Connected to the organization_db database.`)
);

// This is the initial menu that allows the user to select what they would like to do and redirect them to the appropriate function based on their selection.
const initialPrompt = () => {
    return inquirer.prompt([
      {
        type: "list",
        name: "whattodo",
        message: "What would you like to do?",
        choices: ["View All Employees","Add Employee","Update Employee Role","View All Roles","Add Role","View All Departments","Add Department","Quit"]
      },
    ])
    .then((answers) => {
      if (answers.whattodo == "View All Employees") {
        return viewAllEmployees();
      } else if (answers.whattodo == "Add Employee") {
        return addEmployee();
      } else if (answers.whattodo == "Update Employee Role") {
        return updateEmployeeRole();
      } else if (answers.whattodo == "View All Roles") {
        return viewAllRoles();
      } else if (answers.whattodo == "Add Role") {
        return addRole();
      } else if (answers.whattodo == "View All Departments") {
        return viewAllDepartments();
      } else if (answers.whattodo == "Add Department") {
        return addDepartment();
      } else if (answers.whattodo == "Quit") {
        console.log("Exiting program");
        process.exit();
      }
    });
  };

// Presents the user with a report of all employees: employee ID's, first names, last names, job titles, departments, salaries, and managers that the employees report to.
const viewAllEmployees = () => {
  return new Promise((resolve, reject) => {
      db.query(`SELECT employees_tb.id, employees_tb.first_name, employees_tb.last_name, roles_tb.title, departments_tb.department_name, roles_tb.salary, employees_tb.manager_id
      FROM employees_tb
      LEFT JOIN roles_tb
      ON employees_tb.role_id = roles_tb.id
      LEFT JOIN departments_tb
      ON roles_tb.department_id = departments_tb.id;`, (err, res) => {
          if (err) reject(err);
          console.table(res);
          resolve(res);
          return initialPrompt();
      });
  });
}

// Allows the user to add an employee to the organization.
const addEmployee = async () => {
  let roleChoices = await availableRoles();
  let mgrChoices = await availableManagers();
  console.log(roleChoices);
  console.log(mgrChoices);
  return new Promise( (resolve, reject) => {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'empFirstName',
        message: "What is the employee's first name?",
      },
      {
        type: 'input',
        name: 'empLastName',
        message: "What is the employee's last name?",
      },
      {
        type: 'list',
        name: 'empRole',
        message: "What is the employee's role?",
        choices: roleChoices.map(item => item.title),
      },
      {
        type: 'list',
        name: 'empMgr',
        message: "Who is the employee's manager?",
        choices: mgrChoices.map(item => item.Manager),
      },
  ])
  .then(async (answers) => {

    let roleResults = await db.promise().query('SELECT roles_tb.id FROM `roles_tb` WHERE `title` = ?', [answers.empRole]);

    let mgrResults = await db.promise().query(`SELECT employees_tb.id FROM employees_tb WHERE CONCAT_WS(' ',employees_tb.first_name, employees_tb.last_name) = ?`, [answers.empMgr]);

    console.log(roleResults[0][0].id);
    console.log(mgrResults[0][0].id);

    db.query(`INSERT INTO employees_tb SET ?`, {first_name: answers.empFirstName, last_name: answers.empLastName, role_id: roleResults[0][0].id, manager_id: mgrResults[0][0].id}, (err) => {
        if (err) reject (err);
        resolve();
        console.log(`Added ${answers.empFirstName + ` ` + answers.empLastName} to the database`);
        return initialPrompt();
        })
    
    resolve();

  });
});
};

// Allows the user to update an employee's role with the organization.
const updateEmployeeRole = async () => {
  let empChoices = await availableEmployees();
  let roleChoices = await availableRoles();
  console.log(empChoices);
  console.log(roleChoices);
  return new Promise( (resolve, reject) => {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'empToUpdate',
        message: "Which employee's role do you want to update?",
        choices: empChoices.map(item => item.Employee),
      },
      {
        type: 'list',
        name: 'newEmpRole',
        message: "Which role do you want to assign the selected employee?",
        choices: roleChoices.map(item => item.title),
      },
  ])
  .then(async (answers) => {

    let roleResults = await db.promise().query('SELECT roles_tb.id FROM `roles_tb` WHERE `title` = ?', [answers.newEmpRole]);

    let empResults = await db.promise().query(`SELECT employees_tb.id FROM employees_tb WHERE CONCAT_WS(' ',employees_tb.first_name, employees_tb.last_name) = ?`, [answers.empToUpdate]);

    console.log(roleResults[0][0].id);
    console.log(empResults[0][0].id);

    db.query(`UPDATE employees_tb SET employees_tb.role_id = ? WHERE employees_tb.id = ?`, [roleResults[0][0].id, empResults[0][0].id], (err) => {
        if (err) reject (err);
        resolve();
        console.log(`Updated role for ${answers.empToUpdate} in the database`);
        return initialPrompt();
        })
    
    resolve();

  });
});
};

// Presents the user with a report of all roles.
const viewAllRoles = () => {
  return new Promise((resolve, reject) => {
      db.query(`SELECT roles_tb.title, roles_tb.id, departments_tb.department_name, roles_tb.salary
      FROM roles_tb
      LEFT JOIN departments_tb
      ON roles_tb.department_id = departments_tb.id;`, (err, res) => {
          if (err) reject(err);
          console.table(res);
          resolve(res);
          return initialPrompt();
      });
  });
}

// Produces a list of available roles that can be selected when adding an employee or updating an employee's role.
const availableRoles = () => {
  return new Promise((resolve, reject) => {
      db.query(`SELECT roles_tb.title FROM roles_tb;`, (err, res) => {
          if (err) reject(err);
          resolve(res);
      });
  });
}

availableRoles();

// Produces a list of available managers that can be selected when adding an employee to the organization. 
const availableManagers = () => {
  return new Promise((resolve, reject) => {
      db.query(`SELECT CONCAT_WS(' ',employees_tb.first_name,employees_tb.last_name) AS Manager FROM employees_tb;`, (err, res) => {
          if (err) reject(err);
          resolve(res);
      });
  });
}

availableManagers();

// Produces a list of available departments that can be selected when adding a role to the organization.
const availableDepartments = () => {
  return new Promise((resolve, reject) => {
      db.query(`SELECT departments_tb.department_name
      FROM departments_tb;`, (err, res) => {
          if (err) reject(err);
          resolve(res);
      });
  });
}

availableDepartments();

// Produces a list of available employees that can be selected when updating an employee's role in the organization.
const availableEmployees = () => {
  return new Promise((resolve, reject) => {
      db.query(`SELECT CONCAT_WS(' ',employees_tb.first_name,employees_tb.last_name) AS Employee
      FROM employees_tb;`, (err, res) => {
          if (err) reject(err);
          resolve(res);
      });
  });
}

availableEmployees();

// Allows the user to add a role to the organization.
const addRole = async () => {
  let deptChoices = await availableDepartments();
  console.log(deptChoices);
  return new Promise( (resolve, reject) => {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'newRole',
        message: "What is the name of the role?",
      },
      {
        type: 'input',
        name: 'newRoleSalary',
        message: "What is the salary of the role?",
      },
      {
        type: 'list',
        name: 'newRoleDept',
        message: "Which department does the role belong to?",
        choices: deptChoices.map(item => item.department_name),
      },
    ])
  .then(async (answers) => {

    let deptResults = await db.promise().query('SELECT departments_tb.id FROM `departments_tb` WHERE departments_tb.department_name = ?', [answers.newRoleDept]);

    console.log(deptResults[0][0].id);

    db.query(`INSERT INTO roles_tb SET ?`, {title: answers.newRole, salary: answers.newRoleSalary, department_id: deptResults[0][0].id}, (err) => {
        if (err) reject (err);
        resolve();
        console.log(`Added ${answers.newRole} to the database`);
        return initialPrompt();
        })
    
    resolve();

  });
});
};

// Presents user with a report of all departments in the organization.
const viewAllDepartments = () => {
  return new Promise((resolve, reject) => {
      db.query(`SELECT departments_tb.department_name, departments_tb.id
      FROM departments_tb;`, (err, res) => {
          if (err) reject(err);
          console.table(res);
          resolve(res);
          return initialPrompt();
      });
  });
}

// Allows user to add a department to the organization.
const addDepartment = async () => {

  return new Promise( (resolve, reject) => {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'newDepartment',
        message: "What is the name of the department?",
      },
    ])
  .then(async (answers) => {

    db.query(`INSERT INTO departments_tb SET ?`, {department_name: answers.newDepartment}, (err) => {
        if (err) reject (err);
        resolve();
        console.log(`Added ${answers.newDepartment} to the database`);
        return initialPrompt();
        })
    
    resolve();

  });
});
};

// This function triggers all user prompts upon running "node index.js" from the command line.
const init = () => {
    initialPrompt()
  };
  
// This function calls the "init()" function to start the initial prompt.
init();
