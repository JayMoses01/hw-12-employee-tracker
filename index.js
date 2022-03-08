const inquirer = require('inquirer');
const fs = require('fs'); // Can probably remove this one.
const Department = require('./lib/Department')
const Employee = require('./lib/Employee')
const Role = require('./lib/Role')
const cTable = require('console.table');
//const server = require('./server.js')

var allEmployees = [];
var allRoles = [];
var allDepartments = [];

// Require mysql2
const mysql = require('mysql2');

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
        return init();
      }
    });
  };

// Presents user with a report of all employees.
/*
const viewAllEmployees = () => {

  db.promise().query(`SELECT employees_tb.id, employees_tb.first_name, employees_tb.last_name, roles_tb.title, departments_tb.department_name, roles_tb.salary, employees_tb.manager_id FROM employees_tb LEFT JOIN roles_tb ON employees_tb.role_id = roles_tb.id LEFT JOIN departments_tb ON roles_tb.department_id = departments_tb.id;`
    .then( ([rows,fields]) => {
      console.log(rows);
    })
    .catch(console.log)
    .then( () => db.end()));
};
*/

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

// Allows user to add employee.
const addEmployee = () => {
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
      type: 'input',
      name: 'empRole',
      message: "What is the employee's role?",
      // Choices should actually be a SELECT statement to return all current roles--not hard-coded.
      choices: ["Customer Service","Sales Lead","Salesperson","Lead Engineer","Software Engineer","Account Manager","Accountant","Legal Team Lead","Lawyer"] // Use variable called "empRoles"
    },
    {
      type: 'input',
      name: 'empMgr',
      message: "Who is the employee's manager?",
      // Choices should actually be a SELECT statement to return all current employees--not hard-coded.
      choices: ["None","John Doe","Mike Chan","Ashley Rodriguez","Kevin Tupik","Kumal Singh","Malia Brown"] // Use variable called "employees"
    },
  ])
  .then((answers) => {
    let employee = new Employee(answers.empFirstName, answers.empLastName, answers.empRole, answers.empMgr);
    allEmployees.push(employee);
    console.log(`Added ${answers.empFirstName + answers.empLastName} to the database`)
    return initialPrompt();
  });
};

// Allows user to update an employee's role with the organization.
const updateEmployeeRole = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'empToUpdate',
      message: "Which employee's role do you want to update?",
      // Choices should actually be a SELECT statement to return all current employees--not hard-coded.
      choices: ["John Doe","Mike Chan","Ashley Rodriguez","Kevin Tupik","Kunal Singh","Malia Brown","Sarah Lourd","Tom Allen","Sam Kash"] // Use variable called "employees"
    },
    {
      type: 'input',
      name: 'newEmpRole',
      message: "Which role do you want to assign the selected employee?",
      // Choices should actually be a SELECT statement to return all current roles--not hard-coded.
      choices: ["Sales Lead","Salesperson","Lead Engineer"]
    },
  ])
  .then((answers) => {
    let department = new Department(answers.newDepartment);
    allDepartments.push(department);
    console.log(`Updated role for ${answers.empToUpdate} in the database`)
    return initialPrompt();

  });
};

// Presents user with a report of all roles.
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



// Allows user to add a role to the organization.
const addRole = () => {
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
      type: 'input',
      name: 'newRoleDept',
      message: "Which department does the role belong to?",
      // Choices should actually be a SELECT statement to return all current departments--not hard-coded.
      choices: ["Engineering","Finance","Legal","Sales","Service"]
    },
  ])
  .then((answers) => {
    let role = new Role(answers.newRole, answers.newRoleSalary, newRoleDept);
    allRoles.push(role);
    console.log(`Added ${answers.newRole} to the database`)
    return initialPrompt();
  });
};

// Presents user with a report of all departments.
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
const addDepartment = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'newDepartment',
      message: "What is the name of the department?",
    },
  ])
  .then((answers) => {
    let department = new Department(answers.newDepartment);
    allDepartments.push(department);
    console.log(`Added ${answers.newDepartment} to the database`)
    return initialPrompt();

  });
};

// This function triggers all user prompts upon running "node index.js" from the command line.
const init = () => {
    initialPrompt()
  };
  
// This function calls the "init()" function to start the initial prompt.
init();



