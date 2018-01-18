const editTodo=function(date){
  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", "editTodos.html", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(`${date}=''`);
  window.location.href="/editTodo.html"
}
const ViewTodo=function(title){
  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", "viewTodos.html", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(`${title}=''`);
  window.location.href="/viewTodo.html"
}
const RemoveTodo=function(title){
  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", "deleteTodos.html", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(`${title}=''`);
  window.location.href="/deleteTodo.html"
}
