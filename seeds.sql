-- INSERT DATA FOR TABLES
USE employee_tracker;

-- DEPARTMENT DATA 
INSERT INTO department (name)
VALUES ("Sales"), 
("Engineering"), 
("Finance"), 
("Legal");


-- EMPLOYEE ROLE DATA 
INSERT INTO employee_role (title, salary, department_id) 
VALUES ("Sales Lead", 100000.000, 1), 
("Salesperson", 80000.000, 1), 
("Lead Engineer", 150000.000, 2), 
("Software Engineer", 120000.000, 2), 
("Account Manager", 125000.000, 3), 
("Accountant", 250000.000, 3), 
("Legal Team Lead", 190000.000, 4);


-- EMPLOYEE DATA
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 3, null), 
("Mike", "Chan", 4, null), 
("Ashley", "Rodriguez", 3, null), 
("Kevin", "Tupik", 2, null), 
("Malia", "Brown", 6,  null), 
("Sarah", "Lourd", 1, null), 
("Tom", "Alen", 6, null), 
("Christian", "Eckenrode", 2, null);



