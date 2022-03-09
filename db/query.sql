/* Telling MySQL to use this database. */
USE organization_db;

/* View all employees: employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to. */
SELECT employees_tb.id, employees_tb.first_name, employees_tb.last_name, roles_tb.title, departments_tb.department_name, roles_tb.salary, employees_tb.manager_id, CONCAT_WS(' ', managers_list.first_name, managers_list.last_name) AS manager_name
FROM employees_tb
LEFT JOIN roles_tb
ON employees_tb.role_id = roles_tb.id
LEFT JOIN departments_tb
ON roles_tb.department_id = departments_tb.id
LEFT JOIN employees_tb managers_list
ON employees_tb.manager_id = managers_list.id;

/* View all roles: job title, role id, the department that role belongs to, and the salary for that role. */
SELECT roles_tb.title, roles_tb.id, departments_tb.department_name, roles_tb.salary
FROM roles_tb
LEFT JOIN departments_tb
ON roles_tb.department_id = departments_tb.id;

/* View all departments: department names and department ID's. */
SELECT departments_tb.department_name, departments_tb.id
FROM departments_tb;
