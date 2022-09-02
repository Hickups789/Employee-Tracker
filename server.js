const consoleTable = require("console.table");
const inquirer = require("inquirer");
const db = require("./db/connection");

afterConnection = () => {
  console.log("************************************");
  console.log("************************************");
  console.log("**                                **");
  console.log("**                                **");
  console.log("**       EMPLOYEE MANAGER         **");
  console.log("**                                **");
  console.log("**                                **");
  console.log("************************************");
  console.log("************************************");
  promptRequest();
};

function promptRequest() {
  inquirer
    .prompt([
      {
        type: "request",
        message: "What would you like to do?",
        name: "choice",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "quit",
        ],
      },
    ])
    .then(function (val) {
      switch (val.choice) {
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployee();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "quit":
          quit();
          break;
      }
    });
}

function viewEmployees() {
  db.query(
    "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, '' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id LEFT JOIN employee e on employee.manager_id = e.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      promptRequest();
    }
  );
}

function viewRoles() {
  db.query(
    "SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id; ",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      promptRequest();
    }
  );
}

function viewDepartments() {
  db.query(
    "SELECT employee.first_name, employee.last_name, department.name AS department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee id; ",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      promptRequest();
    }
  );
}



function addEmployee() {
  inquirer
    .prompt([
      {
        name: "firstname",
        type: "input",
        message: "Please enter employee first name",
      },
      {
        name: "lastname",
        type: "input",
        message: "Please enter employee last name",
      },
      {
        name: "role",
        type: "list",
        message: "what is employee's role?",
        choices: getRole(),
      },
      {
        name: "choices",
        type: "rawlist",
        message: "what is the manager's name?",
        choices: getManager(),
      },
    ])
    .then(function (val) {
      const roleId = getRole().indexOF(val.role) + 1;
      const managerId = getManager().indexOf(val.choice) + 1;
      db.query(
        "INSERT INTO employee SET ?",
        {
          first_name: val.firstname,
          last_name: val.last_name,
          manager_id: managerId,
          role_id: roleId,
        },
        function (err) {
          if (err) throw err;
          console.table(val);
          promptRequest();
        }
      );
    });
}

function updateEmployee() {
  db.query(
    "SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id =role.id;",
    function (err, res) {
      if (err) throw err;
      console.log(res);
      inquirer
        .prompt([
          {
            name: "lastname",
            type: "rawlist",
            choices: function () {
              const lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: "Enter the employee last name?",
          },
          {
            name: "role",
            type: "rawlist",
            message: "Enter employee's new title",
            choices: addRole(),
          },
          
        ])
        .then(function (val) {
          const roleId = addRole().indexOf(val.role) + 1;
          db.query(
            "UPDATE employee SET WHERE ?",
            {
              last_name: val.last_name,
            },
            {
              role_id: roleId,
            },

            function (err) {
              if (err) throw err;
              console.table(val);
              promptRequest();
            });
        });
    });
}

function addRole () {
 db.query("SELECT role.tile AS Title, role.salary AS Salary FROM role", function(err,res) {
     inquirer.prompt([
         {
             name:"Title",
             type: "input",
             message:"What is the title of role?"
         },
         {
           name:"Salary",
           type: "input",
           message: "Please enter salary"  
         }

     ]).then(function(res) {
         db.query("INSERT INTO role SET ?",
         {
           title: res.Title,
           salary: res.Salary,
         },
         function(err){
             if (err) throw err
             console.table(res);
             promptRequest();
         }
         )
     })
 })
}

const roleArr = [];
function getRole() {
  db.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }
  });
  return roleArr;
}

const managerArr = [];
function getManager() {
  db.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        managerArr.push(res[i].first_name);
      }
    }
  );
  return managerArr;
}
