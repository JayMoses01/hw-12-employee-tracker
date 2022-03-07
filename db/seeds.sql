INSERT INTO departments_tb (department_name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales"),
       ("Service");

INSERT INTO roles_tb (title, salary, department_id)
VALUES ("Sales Lead", 85000, 4),
       ("Salesperson", 85000, 4),
       ("Lead Engineer", 85000, 1),
       ("Software Engineer", 85000, 1),
       ("Account Manager", 85000, 5),
       ("Accountant", 85000, 2),
       ("Legal Team Lead", 85000, 3),
       ("Lawyer", 85000, 3);

INSERT INTO employees_tb (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
       ("Mike", "Chan", 2, 1),
       ("Ashley", "Rodriguez", 3, NULL),
       ("Kevin", "Tupik", 4, 3),
       ("Kunal", "Singh", 5, 6),
       ("Malia", "Brown", 6, 7),
       ("Sarah", "Lourd", 7, 8),
       ("Tom", "Allen", 8, NULL),
       ("Sam", "Kash", 1, 7);




