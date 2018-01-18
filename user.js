let Todo = require('./todo.js');
let todo = new Todo();
const User = function() {
  this.name = "",
    this.validUsers = [{
        name: "salmans",
        Fullname: "Salman Shaik"
      },
      {
        name: "srijayanths",
        Fullname: "Srijayanth Sridhar"
      },
      {
        name: "vivekh",
        Fullname: "Vivek Haridas"
      }
    ];
  this.todos = []
};
User.prototype = {
  set Name(name) {
    this.name = name;
  },
  setTodos: function() {
    return this.todos = todo.getCurrentUserTodos(this.name);
  },
  get Todos() {
    return this.todos;
  },
  updateTodos: function(todos) {
    this.todos = todos;
    todo.setCurrentUserTodos(this.name, this.todos);
  },
  writeTodos: function() {
    todo.updateTodos();
  },
  get ValidUsers() {
    return this.validUsers;
  },
  set Validuser(validUser){
    this.validUsers=validUser;
  }
};
module.exports = User;
