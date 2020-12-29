
INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Marketing"), ("Human Resources"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 80000, 1), ("Salesperson", 60000, 1), ("Head Engineer", 200000, 2),
("Software Engineer", 100000, 2), ("Digital Marketer", 65000, 3), ("Head of HR", 85000, 4),("Account Manager", 120000, 5), ("Accountant", 90000, 5),
("Legal Team Lead", 300000, 6), ("Lawyer", 150000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mitch", "Fenbert", 1, 3), ("Michael", "O'brien", 2, 1), ("Wells", "Scott", 3, null), ("Nick", "Prewitt", 4, 3), ("Charlie", "Haught", 6, null),
("Allison", "Funchess", 7, null), ("Michelle", "Bonnot", 8, 6), ("Caroline", "Laboon", 3, 2);