const openTodo=function(title){
  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", "viewTodos.html", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(`${title}=''`);
  window.location.href="/viewTodo.html"
}
