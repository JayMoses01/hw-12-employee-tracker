/* Deleting the organization_db database if it exists and then recreating it. */
DROP DATABASE IF EXISTS organization_db;
CREATE DATABASE organization_db;

/* Telling MySQL to use the organization_db database which contains all organizational tables. */
USE organization_db;

/* Creating the departments_tb table. */
CREATE TABLE departments_tb (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(100) NOT NULL
);

/* Creating the roles_tb table. */
CREATE TABLE roles_tb (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id)
    REFERENCES departments_tb(id)
    ON DELETE SET NULL
);

/* Creating the employees_tb table. */
CREATE TABLE employees_tb (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT DEFAULT NULL,
    FOREIGN KEY (role_id) REFERENCES roles_tb(id)
      ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES employees_tb(id)
      ON DELETE SET NULL
);
