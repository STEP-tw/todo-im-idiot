let webApp = require('./webapp.js');
const fs = require('fs');
let getFileData = require('./lib/utils.js').getFileData;
let getMIMEType = require('./lib/utils.js').getMIMEType;
let getDateAndTimeInArray = require('./lib/utils.js').getDateAndTimeInArray;
let timeStamp= require('./lib/time.js').timeStamp;
let parseData=require('./lib/utils.js').parseData;
let validUsers = [{
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
}];
let todoList=JSON.parse(fs.readFileSync('./data/todoList.json'));
let requestFileHandler = (req, res) => {
  console.log(getGETRequests(req.url));
  let fileName = `./public${req.url}`;
  let fileData = getFileData(fs, fileName);
  res.setHeader('Content-Type', getMIMEType(req.url));
  res.write(fileData);
  res.end();
};
const getTodosInTable=(todos)=>{
  let table="<table>";
  todos.forEach((element)=>{
    table+="<tr>";
    table+=`<td>${element.date}</td>`;
    table+=`<td class="todoinfo"><p><h4>${element.title}</h4><br />${element.description}</p></td>`;
    table+='<td><a href="/delete">DELETE</a></td>';
    table+="</tr>";
  });
  table+="</table>";
  return table;
};
const loginHandler=(req,res)=>{
  console.log(getGETRequests(req.url));
  let fileName = `./public${req.url}`;
  let fileData = getFileData(fs, fileName).toString();
  res.setHeader('Content-Type', getMIMEType(req.url));
  if(req.cookies.logInFailed) res.write(fileData.replace('LOGIN MESSAGE','LOGIN FAILED'));
  else res.write(fileData.replace('LOGIN MESSAGE',''));
  res.end();
};
const toS=(object)=>JSON.stringify(object,null,2);
const logRequests=(req,res)=>{
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`, ''
  ].join('\n');
  fs.appendFile('./data/request.log', text, () => {});
}
const getGETRequests = (url) => `${getDateAndTimeInArray()} GET  ${url}`;
const getPOSTRequests = (url) => `${getDateAndTimeInArray()} POST ${url}`;

let app = webApp.create();
app.use(logRequests);
app.get('/', (req, res) => res.redirect('/login.html'));
app.get('/login.html', loginHandler);
app.get('/addTodo.html', requestFileHandler);
app.get('/editTodo.html', requestFileHandler);
app.get('/editTodoItem.html', requestFileHandler);
app.get('/homepage.html', requestFileHandler);
app.get('/viewTodo.html', requestFileHandler);
app.get('/js/addTodo.js', requestFileHandler);
app.get('/css/master.css', requestFileHandler);
app.get('/logout',(req,res)=>{
  res.setHeader('Set-Cookie', `user='';Expires=${new Date(1).toUTCString()}`);
  res.redirect('/login.html');
});
app.post('/login.html', (req, res) => {
  console.log(getPOSTRequests(req.url));
  let user = validUsers.find(u => u.name == req.body.username);
  if (!user) {
    res.setHeader('Set-Cookie', `logInFailed=true; Max-Age=5`);
    res.redirect('/login.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie', `user=${req.body.username}`);
  user.sessionid = sessionid;
  res.redirect('/homepage.html');
});

app.post('/addTodo.html', (req, res) => {
  console.log(getPOSTRequests(req.url));
  req.body.date=getDateAndTimeInArray().replace('[', '').replace(']', '');
  req.body.title=parseData(req.body.title);
  req.body.description=parseData(req.body.description);
  for (var i = 1; i < 11; i++) {
    if(req.body[`item${i}`]!=undefined)
     req.body[`item${i}`]=parseData(req.body[`item${i}`]);
  }
  if(todoList[req.cookies.user]==undefined) todoList[req.cookies.user]=[];
  todoList[req.cookies.user].push(req.body);
  fs.writeFileSync('./data/todoList.json',toS(todoList));
  
});
module.exports = app;
