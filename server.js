const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const util = require("util");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employees_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  runTracker();
});

connection.query = util.promisify(connection.query);

function runTracker() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "selection",
        message: "What would you like to do?",
        choices: [
          "Add a new Department",
          "Add a new Role",
          "Add a new Employee",
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Update an Employee Role",
          "Exit",
        ],
      },
    ])
    .then(({ selection }) => {
      switch (selection) {
        case "Add a new Department":
          addDepartment();
          break;
        case "Add a new Role":
          addRole();
          break;
        case "Add a new Employee":
          addEmployee();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "View All Employees":
          viewEmployees();
          break;
        case "Update an Employee Role":
          updateEmployeeRole();
          break;
        case "Exit":
          exit();
        default:
          console.log("Hope you have a wonderful day!");
      }
    });
}

// Add Department Section

const addDepartment = () => {
  console.log("add department here");
  inquirer
    .prompt({
      name: "department",
      message: "What Department would you like to add?",
      type: "input",
    })
    .then(({ department }) => {
      connection.query(
        `INSERT INTO department SET ?`,
        {
          name: department,
        },
        (err) => {
          if (err) throw err;
          console.log(`New Department: ${department} was added!`);
          viewDepartments();
        }
      );
    });
};

// Add Role Section

function addRole() {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the role's title?",
        },
        {
          name: "salary",
          type: "input",
          message: "What is the role's salary?",
        },
        {
          name: "deptName",
          type: "list",
          message: "What department does this role belong to?",
          choices: function () {
            let choiceArray = [];
            for (let i = 0; i < res.length; i++) {
              choiceArray.push({ name: res[i].name, value: res[i].id });
            }
            return choiceArray;
          },
        },
      ])
      .then((userInput) => {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: userInput.title,
            salary: userInput.salary,
            department_id: userInput.deptName,
          },
          function (err, res) {
            if (err) throw err;
            runTracker();
          }
        );
      });
  });
}

// Add Employee Section

const addEmployee = () => {
  console.log("Adding a new employee.");
  let addNewEmployee = {};
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    console.log(res);
    const departmentChoices = res.map((row) => ({
      value: row.id,
      name: row.name,
    }));

    return inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the employee's first name?",
        },
        {
          type: "input",
          name: "last_name",
          message: "What is the employee's last name?",
        },
        {
          type: "list",
          name: "allRoles",
          message: "What is the employee's role?",
          choices: function () {
            let rolesArray = [];
            for (let i = 0; i < res.length; i++) {
              rolesArray.push(res[i].title);
            }
            return rolesArray;
          },
        },
        {
          type: "list",
          name: "whichDepartment",
          message: "What department is the employee in?",
          choices: departmentChoices,
        },
      ])
      .then((response) => {
        {
          addNewEmployee.first_name = response.first_name;
          addNewEmployee.last_name = response.last_name;
          connection.query(
            `SELECT * FROM role WHERE title = ?`,
            response.allRoles,
            (err, res) => {
              if (err) throw err;
              addNewEmployee.role_id = res[0].id;
            }
          );

          connection.query("SELECT * FROM employee", (err, res) => {
            if (err) throw err;
            inquirer
              .prompt([
                {
                  type: "list",
                  name: "manager_name",
                  message: "Who is the employee's manager?",
                  choices: function () {
                    let managerArray = [];
                    for (let i = 0; i < res.length; i++) {
                      managerArray.push(res[i].first_name);
                    }
                    return managerArray;
                  },
                },
              ])
              .then(
                (response) => {
                  connection.query(
                    "SELECT id FROM employee WHERE first_name = ?",
                    response.manager_name,
                    (err, res) => {
                      if (err) throw err;
                      addNewEmployee.manager_id = res[0].id;

                      connection.query(
                        "INSERT INTO employee SET ?",
                        addNewEmployee,
                        (err, res) => {
                          if (err) throw err;
                          runTracker();
                        }
                      );
                    }
                  );
                },
                function (err, res) {
                  if (err) throw err;
                  console.log("New employee added!");
                }
              );
            runTracker();
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

// View Department Section

viewDepartments = () => {
  console.log("View all departments.");
  connection.query(`SELECT * FROM department`, (err, res) => {
    if (err) throw err;
    console.table(res);
    console.log("-----------------");
    runTracker();
  });
};

// View Role Section

viewRoles = () => {
  console.log("View all roles.");
  connection.query(`SELECT * FROM role`, (err, res) => {
    if (err) throw err;
    console.table(res);
    console.log("-----------------");
    runTracker();
  });
};

// View Employee Section

const viewEmployees = () => {
  connection.query("select * from employee;", (err, res) => {
    console.table(res);
    console.log("-----------------");
    runTracker();
  });
};

// Update Employee Section

// Exit/Quit Section

function exit() {
  connection.end();
}
