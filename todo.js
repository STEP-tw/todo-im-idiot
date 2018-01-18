let fs=require('fs');
const Todo=function(){
  this.todos=JSON.parse(fs.readFileSync('./data/todoList.json','utf8'));
  this.currentTodo={};
}
Todo.prototype.getCurrentUserTodos = function (user) {
  return this.todos[user];
};
Todo.prototype.setCurrentUserTodos = function(user,todos){
  this.todos[user]=todos;
};
Todo.prototype.updateTodos=function(){
  fs.writeFile('./data/todoList.json',JSON.stringify(this.todos),()=>{});
};
Todo.prototype.setCurrentTodo=function(todo){
  this.currentTodo=todo;
};
Todo.prototype.getCurrentTodo=function(){
  return this.currentTodo;
};
module.exports=Todo;
