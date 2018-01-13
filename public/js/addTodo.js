var counter = 1;
const addTextBox = function(divName) {
  let newdiv = document.createElement('div');
  let name=`item${counter}`;
  newdiv.innerHTML = '<input type="text" name='+name+'>';
  document.getElementById(divName).appendChild(newdiv);
  counter++;
}
let sendDataToServer = function() {
  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", "addTodo.html", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  let title=document.getElementsByName('title')[0].value;
  let description=document.getElementsByName('description')[0].value;
  let postData=`title=${title}&description=${description}`;
  let item=document.getElementsByName('item1')[0];
  let i=2;
  while(item!=undefined){
  postData+=`&item${i-1}=${item.value}`;
  item=document.getElementsByName(`item${i}`)[0];
  i++;
  }
  xhttp.send(postData);
  window.location.href="homepage.html"
}
