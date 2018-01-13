const openTodo=function(date){
  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", "editTodos.html", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(`${date}=''`);
  window.location.href="/editTodo.html"
}
