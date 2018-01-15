let webApp = require('./webapp.js');
const fs = require('fs');
let getFileData = require('./lib/utils.js').getFileData;
let getMIMEType = require('./lib/utils.js').getMIMEType;
let getDateAndTimeInArray = require('./lib/utils.js').getDateAndTimeInArray;
let timeStamp = require('./lib/time.js').timeStamp;
let parseData = require('./lib/utils.js').parseData;
let writeAndTerminate = require('./lib/utils.js').writeAndTerminate;
let getTodosInfoInBlocks = require('./lib/utils.js').getTodosInfoInBlocks;
let getTodoinBlock = require('./lib/utils.js').getTodoinBlock;
let getTodoinReadOnlyBlock = require('./lib/utils.js').getTodoinReadOnlyBlock;
let getRequestedFileData=require('./lib/utils.js').getRequestedFileData;
let getGETRequests=require('./lib/utils.js').getGETRequests;
let getPOSTRequests=require('./lib/utils.js').getPOSTRequests;
let toS=require('./lib/utils.js').toS;
let currentTodo = {};
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
  }
];
let todoList = JSON.parse(getFileData(fs, './data/todoList.json', 'utf8'));
let requestFileHandler = (req, res) => {
  console.log(getGETRequests(req.url));
  let fileData=getRequestedFileData(fs,req.url,res);
  writeAndTerminate(res,fileData);
};
const loginHandler = (req, res) => {
  let fileData=getRequestedFileData(fs,req.url,res);
  if (req.cookies.logInFailed) res.write(fileData.replace('LOGIN MESSAGE', 'LOGIN FAILED'));
  else res.write(fileData.replace('LOGIN MESSAGE', ''));
  res.end();
};
const logRequests = (req, res) => {
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toS(req.headers)}`,
    `COOKIES=> ${toS(req.cookies)}`,
    `BODY=> ${toS(req.body)}`, ''
  ].join('\n');
  fs.appendFile('./data/request.log', text, () => {});
}

const displayTodos = (req, res) => {
  let fileData=getRequestedFileData(fs,req.url,res);
  fileData = fileData.replace('REPLACE ME', getTodosInfoInBlocks(todoList[req.cookies.user]));
  writeAndTerminate(res,fileData);
};
const editTodoHandler = (req, res) => {
  let fileData=getRequestedFileData(fs,req.url,res);
  fileData = fileData.replace('REPLACE ME', getTodoinBlock(currentTodo));
  writeAndTerminate(res,fileData);
}
const viewTodoHandler = (req, res) => {
  let fileData=getRequestedFileData(fs,req.url,res);
  fileData = fileData.replace('REPLACE ME', getTodoinReadOnlyBlock(currentTodo));
  writeAndTerminate(res,fileData);
}
const removeTodoHandler = (req, res) => {
  let fileData=getRequestedFileData(fs,req.url,res);
  fileData = fileData.replace('REPLACE ME', getTodoinReadOnlyBlock(currentTodo));
  fileData = fileData.replace('</div>','<input type="submit" value="DELETE" onclick="clearTodo()"></div>')
  writeAndTerminate(res,fileData);
}
let app = webApp.create();
app.use(logRequests);
app.get('/', (req, res) => res.redirect('/login.html'));
app.get('/login.html', loginHandler);
app.get('/addTodo.html', requestFileHandler);
app.get('/editTodo.html', editTodoHandler);
app.get('/editTodos.html', displayTodos);
app.get('/viewTodo.html', viewTodoHandler);
app.get('/viewTodos.html', displayTodos);
app.get('/deleteTodo.html', removeTodoHandler);
app.get('/deleteTodos.html', displayTodos);
app.get('/homepage.html', requestFileHandler);
app.get('/js/addTodo.js', requestFileHandler);
app.get('/js/editTodos.js', requestFileHandler);
app.get('/js/editTodo.js', requestFileHandler);
app.get('/js/viewTodos.js', requestFileHandler);
app.get('/js/deleteTodos.js', requestFileHandler);
app.get('/js/deleteTodo.js', requestFileHandler);
app.get('/css/master.css', requestFileHandler);
app.get('/image/add.png', requestFileHandler);
app.get('/image/edit.png', requestFileHandler);
app.get('/image/view.png', requestFileHandler);
app.get('/image/delete.png', requestFileHandler);
app.get('/image/coreimage.png', requestFileHandler);
app.get('/image/favicon.ico', requestFileHandler);

app.get('/logout', (req, res) => {
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
  req.body.date = getDateAndTimeInArray().replace('[', '').replace(']', '');
  req.body.title = parseData(req.body.title);
  req.body.description = parseData(req.body.description);
  for (var i = 1; i < 11; i++) {
    if (req.body[`item${i}`] != undefined)
      req.body[`item${i}`] = parseData(req.body[`item${i}`]);
  }
  if (todoList[req.cookies.user] == undefined) todoList[req.cookies.user] = [];
  todoList[req.cookies.user].push(req.body);
  fs.writeFileSync('./data/todoList.json', toS(todoList));
});
app.post('/editTodo.html',(req,res)=>{
  console.log(getPOSTRequests(req.url));
  let date=" "+req.body.date+" ";
  let currentUser = req.cookies.user;
  let currentUserTodos = todoList[currentUser];
  currentUserTodos.forEach((element)=>{
    if(date==element.date) currentTodo=element;
  });
  let currentTodoIndex=currentUserTodos.indexOf(currentTodo);
  currentUserTodos[currentTodoIndex]=req.body;
  todoList[currentUser]=currentUserTodos;
  fs.writeFileSync('./data/todoList.json', toS(todoList));
});

app.post('/editTodos.html', (req, res) => {
  console.log(getPOSTRequests(req.url));
  let title = Object.keys(req.body).join();
  let currentUser = req.cookies.user;
  let currentUserTodos = todoList[currentUser];
  currentUserTodos.forEach((element) => {
    if (element.title == title) currentTodo = element;
  });
});
app.post('/viewTodo.html',(req,res)=>{
  console.log(getPOSTRequests(req.url));
  let date=" "+req.body.date+" ";
  let currentUser = req.cookies.user;
  let currentUserTodos = todoList[currentUser];
  currentUserTodos.forEach((element)=>{
    if(date==element.date) currentTodo=element;
  });
  let currentTodoIndex=currentUserTodos.indexOf(currentTodo);
  currentUserTodos[currentTodoIndex]=req.body;
  todoList[currentUser]=currentUserTodos;
});

app.post('/viewTodos.html', (req, res) => {
  console.log(getPOSTRequests(req.url));
  let title = Object.keys(req.body).join();
  let currentUser = req.cookies.user;
  let currentUserTodos = todoList[currentUser];
  currentUserTodos.forEach((element) => {
    if (element.title == title) currentTodo = element;
  });
});
module.exports = app;
