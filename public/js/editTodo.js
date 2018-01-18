let sendDataToServer=function(){
  let xhttp = new XMLHttpRequest();
  xhttp.open("POST", "editTodo.html", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  let date=document.getElementById('date');
  let title=document.getElementById('title');
  let description=document.getElementById('description');
  let postData=`date=${date.innerText}&title=${title.value}&description=${description.value}`;
  let item=document.getElementById('item1');
  let i=2;
  while(item){
    postData+=`&item${i-1}=${item.value}`;
    item=document.getElementById(`item${i}`);
    i++;
  }
  xhttp.send(postData);
  window.location.href="/homepage.html"
}
var counter=1;
const addTextBox = function(divName) {
  let newdiv = document.createElement('div');
  let name=`item${counter}`;
  newdiv.innerHTML = '<input type="text" name='+name+'>';
  document.getElementById(divName).appendChild(newdiv);
  counter++;
}
