/* Creating seeded departments in the departments_tb table. */
INSERT INTO departments_tb (department_name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales"),
       ("Service");

/* Creating seeded roles in the roles_tb table. */
INSERT INTO roles_tb (title, salary, department_id)
VALUES ("Sales Lead", 85000, 4),
       ("Lead Engineer", 85000, 1),
       ("Legal Team Lead", 85000, 3),
       ("Salesperson", 85000, 4),
       ("Software Engineer", 85000, 1),
       ("Account Manager", 85000, 5),
       ("Accountant", 85000, 2),
       ("Lawyer", 85000, 3);

/* Creating seeded employees in the employees_tb table. */
INSERT INTO employees_tb (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
       ("Mike", "Chan", 2, NULL),
       ("Ashley", "Rodriguez", 3, NULL),
       ("Kevin", "Tupik", 4, 1),
       ("Kunal", "Singh", 5, 2),
       ("Malia", "Brown", 6, 1),
       ("Sarah", "Lourd", 7, NULL),
       ("Tom", "Allen", 8, 3),
       ("Sam", "Kash", 8, 3);
