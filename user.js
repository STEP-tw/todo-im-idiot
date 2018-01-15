const User=function(){
  this.name="",
  this.todos=[],
  this.currentTodo={}
};
User.prototype={
  set Name(name){
    this.name=name;
  },
  get getName(){
    return this.name;
  },
  set Todos(todos){
    this.todos=todos;
  },
  get getTodos(){
    return this.todos;
  },
  set CurrentTodo(currentTodo){
    this.currentTodo=currentTodo;
  },
  get getCurrentTodo(){
    return this.currentTodo;
  }
};
module.exports=User;
