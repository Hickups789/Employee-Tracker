INSERT INTO department (name)
VALUES
('Engineering'),
('Finance'),
('Legal'),
('Sales');

INSERT INTO role (title, salary, department_id)
VALUES
('Software Engineer', 120000, 1),
('Lead Engineer', 150000, 1),
('Account Manager', 160000, 2),
('Accountant', 1250000, 2),
('Legal Team Lead', 250000, 3),
('Lawyer', 190000, 3),
('Sales Lead', 100000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('John', 'Doe', 4, NULL),
('Mike', 'Chan', 4, 1),
('Ashley', 'Rodriguez', 1, NUll),
('Kevin', 'Tupik', 1, 3),
('Kunal', 'Singh', 4, NUll),
('Malia', 'Brown', 2, 5),
('Sarah', 'Lourd', 3, NUll),
('Tom', 'Allen', 3, 7);
