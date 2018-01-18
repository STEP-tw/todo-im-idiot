let webApp = require('./webapp.js');
const fs = require('fs');
let timeStamp = require('./lib/time.js').timeStamp;
let utility= require('./lib/utils.js');
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
let todoList = JSON.parse(fs.readFileSync('./data/todoList.json', 'utf8'));
let requestFileHandler = (req, res) => {
  console.log(utility.getGETRequests(req.url));
  utility.sendRequestedFile(fs, req.url, res,'utf8');
};
let requestImageHandler = (req, res) => {
  console.log(utility.getGETRequests(req.url));
  utility.sendRequestedFile(fs, req.url, res);
};
const loginHandler = (req, res) => {
  let fileData = utility.getRequestedFileData(fs, req.url, res).toString();
  if (req.cookies.logInFailed) res.write(fileData.replace('LOGIN MESSAGE', 'LOGIN FAILED'));
  else res.write(fileData.replace('LOGIN MESSAGE', ''));
  res.end();
};
const logRequests = (req, res) => {
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${utility.toS(req.headers)}`,
    `COOKIES=> ${utility.toS(req.cookies)}`,
    `BODY=> ${utility.toS(req.body)}`, ''
  ].join('\n');
  fs.appendFile('./data/request.log', text, () => {});
}

const displayTodos = (req, res) => {
  console.log(utility.getGETRequests(req.url));
  let fileData = utility.getRequestedFileData(fs, '/displayTodos.html', res).toString();
  let currentUserTodo=todoList[req.cookies.user];
  if(currentUserTodo) fileData = fileData.replace('REPLACE ME', utility.getTodosInfoInBlocks[req.url](currentUserTodo));
  else fileData = fileData.replace('REPLACE ME', 'NO TODOS');

  utility.writeAndTerminate(res, fileData);
};
const editTodoHandler = (req, res) => {
  console.log(utility.getGETRequests(req.url));
  let fileData = utility.getRequestedFileData(fs, req.url, res).toString();
  fileData = fileData.replace('REPLACE ME', utility.getTodoinBlock(currentTodo));
  utility.writeAndTerminate(res, fileData);
}
const viewTodoHandler = (req, res) => {
  console.log(utility.getGETRequests(req.url));
  let fileData = utility.getRequestedFileData(fs, req.url, res).toString();
  fileData = fileData.replace('REPLACE ME', utility.getTodoinReadOnlyBlock(currentTodo));
  utility.writeAndTerminate(res, fileData);
}
const removeTodoHandler = (req, res) => {
  console.log(utility.getGETRequests(req.url));
  let fileData = utility.getRequestedFileData(fs, req.url, res).toString();
  fileData = fileData.replace('REPLACE ME', utility.getTodoinReadOnlyBlock(currentTodo));
  fileData = fileData.replace('</div>', '<input type="submit" value="DELETE" onclick="clearTodo()"></div>')
  utility.writeAndTerminate(res, fileData);
}
const getSelectedTodo = (req, res) => {
  console.log(utility.getPOSTRequests(req.url));
  let title = Object.keys(req.body).join();
  let currentUser = req.cookies.user;
  let currentUserTodos = todoList[currentUser];
  currentUserTodos.forEach((element) => {
    if (element.title == title) currentTodo = element;
  });
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
app.get('/displayTodos.html', displayTodos);
app.get('/deleteTodo.html', removeTodoHandler);
app.get('/deleteTodos.html', displayTodos);
app.get('/homepage.html', requestFileHandler);
app.get('/js/addTodo.js', requestFileHandler);
app.get('/js/editTodos.js', requestFileHandler);
app.get('/js/editTodo.js', requestFileHandler);
app.get('/js/viewTodos.js', requestFileHandler);
app.get('/js/deleteTodos.js', requestFileHandler);
app.get('/js/displayTodos.js', requestFileHandler);
app.get('/js/deleteTodo.js', requestFileHandler);
app.get('/css/master.css', requestFileHandler);
app.get('/image/add.jpg', requestImageHandler);
app.get('/image/edit.jpg', requestImageHandler);
app.get('/image/view.jpg', requestImageHandler);
app.get('/image/delete.jpg', requestImageHandler);
app.get('/image/coreimage.jpg', requestImageHandler);
app.get('/image/favicon.ico', requestImageHandler);

app.get('/logout', (req, res) => {
  res.setHeader('Set-Cookie', `user='';Expires=${new Date(1).toUTCString()}`);
  res.redirect('/login.html');
});

app.post('/login.html', (req, res) => {
  console.log(utility.getPOSTRequests(req.url));
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
  console.log(utility.getPOSTRequests(req.url));
  req.body.date = utility.getDateAndTimeInArray().replace('[', '').replace(']', '');
  req.body.title = utility.parseData(req.body.title);
  req.body.description = utility.parseData(req.body.description);
  for (var i = 1; i < 11; i++) {
    if (req.body[`item${i}`] != undefined)
      req.body[`item${i}`] = utility.parseData(req.body[`item${i}`]);
  }
  if (todoList[req.cookies.user] == undefined) todoList[req.cookies.user] = [];
  todoList[req.cookies.user].push(req.body);
  fs.writeFileSync('./data/todoList.json', utility.toS(todoList));
});
app.post('/editTodo.html', (req, res) => {
  console.log(utility.getPOSTRequests(req.url));
  let date = " " + req.body.date + " ";
  let currentUser = req.cookies.user;
  let currentUserTodos = todoList[currentUser];
  currentUserTodos.forEach((element) => {
    if (date == element.date) currentTodo = element;
  });
  let currentTodoIndex = currentUserTodos.indexOf(currentTodo);
  currentUserTodos[currentTodoIndex] = req.body;
  todoList[currentUser] = currentUserTodos;
  fs.writeFileSync('./data/todoList.json', utility.toS(todoList));
});

app.post('/editTodos.html', getSelectedTodo);
app.post('/viewTodos.html', getSelectedTodo);
app.post('/deleteTodos.html', getSelectedTodo);
app.post('/viewTodo.html', (req, res) => {
  console.log(utility.getPOSTRequests(req.url));
  let date = " " + req.body.date + " ";
  let currentUser = req.cookies.user;
  let currentUserTodos = todoList[currentUser];
  currentUserTodos.forEach((element) => {
    if (date == element.date) currentTodo = element;
  });
  let currentTodoIndex = currentUserTodos.indexOf(currentTodo);
  currentUserTodos[currentTodoIndex] = req.body;
  todoList[currentUser] = currentUserTodos;
});
app.post('/deleteTodo.html', (req, res) => {
  console.log(utility.getPOSTRequests(req.url));
  let date = " " + req.body.date + " ";
  let currentUser = req.cookies.user;
  let currentUserTodos = todoList[currentUser];
  currentUserTodos.forEach(element => {
    if (date == element.date) currentTodo = element
  });
  let currentTodoIndex = currentUserTodos.indexOf(currentTodo);
  currentUserTodos.splice(currentTodoIndex, 1);
  todoList[currentUser] = currentUserTodos;
  fs.writeFileSync('./data/todoList.json', utility.toS(todoList));
});
module.exports = app;
