var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Dani226879!",
  database: "employee_tracker"
});

connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

function start() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Roles",
        "Add Employee",
        "Add Department",
        "Add Role",
        "Update Employee Role",
        "Remove Department",
        "Remove Roles",
        "Remove Employees"
      ]
    })
    .then(function (answer) {
      console.log(answer.action)
      // based on user answer, switch statements below
      switch (answer.action) {
        case "View All Employees":
          viewEmployees();
          break;

        case "View All Employees By Department":
          viewEmployessByDepartment();
          break;

        case "View All Roles":
          viewRoles();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Add Department":
          addDepartment();
          break;

        case "Add Role":
          addRole();
          break;

        case "Update Employee Role":
          updateEmployeeRole();
          break;

        case "Remove Department":
          removeDepartment();
          break;

        case "Remove Roles":
          removeRoles();
          break;

        case "Remove Employees":
          removeEmployees();
          break;

      }
    });
}

// Functions for all the choices
// VIEWS will be .get (read) SELECT
// ADD will be .post (create) INSERT
// UPDATE will be .put (update)
// REMOVE will be .delete(delete)

function viewEmployees() {
  connection.query("SELECT * FROM employee", function (err, res) {
    console.log(res)
    // if (err) throw err;
    for (var i = 0; i < res.length; i++) {

      if (res[i]) {
        // console.log("as a string")
        // console.log(res[i].id + "\t" + res[i].first_name + "\t" + res[i].last_name + "\t" + res[i].role_id);
        console.table(res[i])
      }

    }
    start()
  })

}

function viewEmployessByDepartment() {
  connection.query("SELECT * FROM employee JOIN employee_role ON employee_role.id = employee.role_id JOIN department ON department.id = employee_role.department_id", function (err, res) {
    console.log(res)
    for (var i = 0; i < res.length; i++) {
      if (res[i]) {
        // console.log(res[i].id + "\t" + res[i].first_name + "\t" + res[i].last_name + "\t" + res[i].role_id + "\t" + res[i].manager_id + "\t" + res[i].title + "\t" + res[i].salary + "\t" + res[i].department_id + "\t" + res[i].name);
        console.table(res[i])
      }

    }
    start()
  })
}

function viewRoles() {
  connection.query("SELECT * FROM employee_role", function (err, res) {
    for (var i = 0; i < res.length; i++) {
      if (res[i]) {
        // console.log(res[i].id + "\t" + res[i].title + "\t" + res[i].salary + "\t" + res[i].department_id);
        console.table(res[i])
      }

    }
    start()
  })
}

function addEmployee() {

  connection.query("SELECT title FROM employee_role", function (err, res) {
    console.log(res)
    var employee_title = []

    for (var i = 0; i < res.length; i++) {

      // pushing the results into the employee title array
      employee_title.push(res[i].title)
      console.log(employee_title)
    }

    // The prompts need to live inside the asynchronus query
    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "Enter first name of employee"
        },
        {
          name: "last_name",
          type: "input",
          message: "Enter last name of employee?"
        },
        {
          name: "employee_role",
          type: "list",
          message: "What is the role of new employee?",
          pageSize: 7,
          choices: employee_title
        }
      ])

      .then(function (answer) {
        // when finished prompting, insert new employee info into table
        connection.query("SELECT id FROM employee_role WHERE title = ? ",
          [answer.employee_title],
          function (err, res) {
            if (err) throw err;
            connection.query(
              "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)",
              [answer.first_name, answer.last_name, res.id]
              ,
              function (err) {
                if (err) throw err;
                console.log("Your new employee has been entered");

                start();
              }
            );
          }
        )
      });
  }
  )
}
// prompt for info about the employee


//   NOT WORKING WHEN ENTER NEW DEPARTMENT.  GET THIS ERROR:  Unknown column 'department' in 'field list'
function addDepartment() {
  // prompt for info about the new department
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "Enter new department name"
      }
      // NEED TO FIGURE OUT HOW TO ADD ID
    ])
    .then(function (answer) {
      // when finished prompting, insert new depsrtment info into table
      connection.query(
        "INSERT INTO department(name) VALUES (?)",

        [answer.department],

        function (err) {
          if (err) throw err;
          console.log("Your new department has been entered");

          start();
        }
      );
    });
}

//   NOT WORKING WHEN ENTER NEW DEPARTMENT.  GET THIS ERROR:  Unknown column 'department' in 'field list'
function addRole() {

  connection.query("SELECT name FROM department", function (err, res) {
    console.log(res)
    var role_title = []
    for (var i = 0; i < res.length; i++) {

      role_title.push(res[i].name)
      console.log(role_title)
    }

    inquirer
      .prompt([
        {
          name: "role",
          type: "input",
          message: "Enter new role name"
        },
        {
          name: "salary",
          type: "input",
          message: "Enter new role salary"
        },
        {
          name: "employee_role",
          type: "list",
          message: "What is the department for the new role?",
          pageSize: 7,
          choices: role_title
        }

      ])
      .then(function (answer) {
        // when finished prompting, insert new depsrtment info into table
        connection.query("SELECT id FROM department WHERE name = ? ",
          [answer.role_title],
          function (err, res) {
            if (err) throw err;
            connection.query(
              "INSERT INTO employee_role(title, salary, department_id) VALUES (?, ?, ?)",

              [answer.role, answer.salary, res.id],

              function (err) {
                if (err) throw err;
                console.log("Your new role has been entered");

                start();
              }
            )
          }
        );
      }
      )
  })
}
// prompt for info about the new department

function updateEmployeeRole() {
  connection.query("SELECT last_name FROM employee", function (err, res) {
    console.log(res)

    var employee_last_name = []
    for (var i = 0; i < res.length; i++) {
      employee_last_name.push(res[i].last_name)
    }

    connection.query("SELECT title FROM employee_role", function (err, res) {

      var employee_title = []
      for (var i = 0; i < res.length; i++) {
        employee_title.push(res[i].title)
      }

      inquirer.prompt([
        {
          name: "last_name",
          type: "list",
          message: "Enter the last name of the employee you want to update",
          choices: employee_last_name
        },
        {
          name: "new_role",
          type: "list",
          message: "What new role would you like to give this employee?",
          choices: employee_title
        }
      ])
        .then(function (answer) {

          connection.query("SELECT id FROM employee_role WHERE title = ?",
            [answer.new_role],

            function (err, res) {
              console.log('ID of selected employee_role', res, res[0].id, answer.last_name)
              if (err) throw err;
              connection.query("UPDATE employee SET ? WHERE ?",
              [
                {
                  role_id: res[0].id
                },
                {
                  last_name: answer.last_name
                }
              ], function (error, res) {
                  if (error){
                    console.log('Ahhhhh', error)
                    throw err;
                  }
                  start();
                }
              )
            }
          )
        })
    })
  })
}


// PROMPT IS WORKING, BUT WHEN TRY TO DELETE, THEN GET THIS ERROR: Unknown column 'role' in 'field list'
function removeDepartment() {
  // prompt for info about the employee
  inquirer
    .prompt([
      {
        name: "remove_department",
        type: "input",
        message: "Enter the name of the department you want to delete"
      }
    ])
    .then(function (answer) {
      // when finished prompting, delete department from table
      connection.query(
        "DELETE FROM department WHERE name = ?",
        [
          answer.remove_deprtment
        ],
        function (err) {
          if (err) throw err;
          console.log("A department has been removed");

          start();
        }
      );
    });
}

function removeRoles() {
  // prompt for info about the employee
  inquirer
    .prompt([
      {
        name: "remove_roles",
        type: "input",
        message: "Enter the name of the role you want to delete"
      }
    ])
    .then(function (answer) {
      // when finished prompting, delete department from table
      connection.query(
        "DELETE FROM employee_role WHERE title = ?",
        [
          answer.remove_roles
        ]
        ,
        function (err) {
          if (err) throw err;
          console.log("A department has been removed");

          start();
        }
      );
    });
}

function removeEmployees() {
  // prompt for info about the employee
  inquirer
    .prompt([
      {
        name: "remove_employees",
        type: "input",
        message: "Enter the last name of the employee you want to delete"
      }
    ])
    .then(function (answer) {
      // when finished prompting, delete department from table
      connection.query(
        "DELETE FROM employee WHERE last_name = ?",
        [
          answer.remove_employees,
        ],
          
        function (err) {
          if (err) throw err;
          console.log("An employee has been removed");

          start();
        }
      );
    });
}