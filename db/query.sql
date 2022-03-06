/* View all employees: employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to */
SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary, employee.manager_id
FROM employee
LEFT JOIN employee
ON employee.role_id = role.id
LEFT JOIN role
ON role.department_id = department.id
ORDER BY employee.id;


/* View all roles: job title, role id, the department that role belongs to, and the salary for that role */
SELECT role.title, role.id, department.name, role.salary
FROM role
LEFT JOIN role
ON role.department_id = department.id;
ORDER BY role.id;


/* View all departments: department names and department ids */
SELECT department.department_name, department_id
FROM department
ORDER BY department_id;














