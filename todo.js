let fs=require('fs');
const todo=function(){
  this.todos=JSON.parse(fs.readFileSync('./date/todoList.js','utf8'));
}
todo.prototype.getCurrentUserTodos = function (user) {
  
};
