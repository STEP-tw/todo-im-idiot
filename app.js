let webApp = require('./webapp.js');
const fs = require('fs');
let timeStamp = require('./lib/time.js').timeStamp;
let utility = require('./lib/utils.js');
let User = require('./user.js');
let Todo = require('./todo.js');
let user = new User();
let todo = new Todo();
let serverHandlers = require('./server_handlers.js');
let handlers = {
  editTodoHandler: (req, res) => {
    console.log(utility.getGETRequests(req.url));
    let fileData = utility.getRequestedFileData(fs, req.url, res).toString();
    fileData = fileData.replace('REPLACE ME', utility.getTodoinBlock(todo.getCurrentTodo()));
    utility.writeAndTerminate(res, fileData);
  },
  viewTodoHandler: (req, res) => {
    console.log(utility.getGETRequests(req.url));
    let fileData = utility.getRequestedFileData(fs, req.url, res).toString();
    fileData = fileData.replace('REPLACE ME', utility.getTodoinReadOnlyBlock(todo.getCurrentTodo()));
    utility.writeAndTerminate(res, fileData);
  },
  removeTodoHandler: (req, res) => {
    console.log(utility.getGETRequests(req.url));
    let fileData = utility.getRequestedFileData(fs, req.url, res).toString();
    fileData = fileData.replace('REPLACE ME', utility.getTodoinReadOnlyBlock(todo.getCurrentTodo()));
    fileData = fileData.replace('</div>', '<input type="submit" value="DELETE" onclick="clearTodo()"></div>')
    utility.writeAndTerminate(res, fileData);
  },
  displayTodos: (req, res) => {
    console.log(utility.getGETRequests(req.url));
    let fileData = utility.getRequestedFileData(fs, '/displayTodos.html', res).toString();
    let todos = user.Todos;
    if (todos.length > 0) fileData = fileData.replace('REPLACE ME', utility.getTodosInfoInBlocks[req.url](todos));
    else fileData = fileData.replace('REPLACE ME', 'NO TODOS');
    utility.writeAndTerminate(res, fileData);
  },
  getSelectedTodo: (req, res) => {
    console.log(utility.getPOSTRequests(req.url));
    let title = Object.keys(req.body).join();
    let todos = user.Todos;
    todos.forEach((element) => {
      if (element.title == title) todo.setCurrentTodo(element);
    });
  }
}
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
let redirectLoggedInUserToHome = (req, res) => {
  if (req.urlIsOneOf(['/', '/login.html']) && req.user) res.redirect('/homepage.html');
}
let redirectLoggedOutUserToLogin = (req, res) => {
  let allUrls=['/',
  '/homepage.html',
  '/addTodo.html',
  '/editTodos.html',
  '/viewTodos.html',
  '/displayTodos.html',
  '/deleteTodos.html',
  '/editTodo.html',
  '/viewTodo.html',
  '/deleteTodo.html',
];
  if (req.urlIsOneOf(allUrls) && !req.user) res.redirect('/login.html');
};

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
  let currentUserTodos = user.Todos;
  currentUserTodos.forEach((element) => {
    if (element.title == title) todo.setCurrentTodo(element);
  });
}
let loadUser = (req, res) => {
  let sessionid = req.cookies.sessionid;
  let registered_users = user.ValidUsers;
  let currentUser = registered_users.find(u => u.sessionid == sessionid);
  if (sessionid && currentUser) req.user = currentUser;
};
let app = webApp.create();
app.use(logRequests);
app.use(loadUser);
app.use(redirectLoggedInUserToHome);
app.use(redirectLoggedOutUserToLogin);
app.get('/', (req, res) => res.redirect('/login.html'));
app.get('/login.html', serverHandlers.loginHandler);
app.get('/addTodo.html', serverHandlers.requestFileHandler);
app.get('/editTodos.html', handlers.displayTodos);
app.get('/viewTodos.html', handlers.displayTodos);
app.get('/displayTodos.html', handlers.displayTodos);
app.get('/deleteTodos.html', handlers.displayTodos);
app.get('/editTodo.html', handlers.editTodoHandler);
app.get('/viewTodo.html', handlers.viewTodoHandler);
app.get('/deleteTodo.html', handlers.removeTodoHandler);
app.get('/homepage.html', serverHandlers.requestFileHandler);
app.get('/js/addTodo.js', serverHandlers.requestFileHandler);
app.get('/js/editTodos.js', serverHandlers.requestFileHandler);
app.get('/js/editTodo.js', serverHandlers.requestFileHandler);
app.get('/js/viewTodos.js', serverHandlers.requestFileHandler);
app.get('/js/deleteTodos.js', serverHandlers.requestFileHandler);
app.get('/js/displayTodos.js', serverHandlers.requestFileHandler);
app.get('/js/deleteTodo.js', serverHandlers.requestFileHandler);
app.get('/css/master.css', serverHandlers.requestFileHandler);
app.get('/image/add.jpg', serverHandlers.requestImageHandler);
app.get('/image/edit.jpg', serverHandlers.requestImageHandler);
app.get('/image/view.jpg', serverHandlers.requestImageHandler);
app.get('/image/delete.jpg', serverHandlers.requestImageHandler);
app.get('/image/coreimage.jpg', serverHandlers.requestImageHandler);
app.get('/image/favicon.ico', serverHandlers.requestImageHandler);
app.get('/logout', (req, res) => {
  res.setHeader('Set-Cookie', `user='';Expires=${new Date(1).toUTCString()}`);
  res.redirect('/login.html');
});

app.post('/login.html', (req, res) => {
  console.log(utility.getPOSTRequests(req.url));
  let registered_users = user.ValidUsers;
  let currentUser = registered_users.find(u => u.name == req.body.username);
  if (!currentUser) {
    res.setHeader('Set-Cookie', `logInFailed=true; Max-Age=5`);
    res.redirect('/login.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie', `sessionid=${sessionid}`);
  user.Name = req.body.username;
  currentUser.sessionid = sessionid;
  user.Validusers = registered_users;
  user.setTodos();
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
  let todos = user.Todos;
  if (todos == undefined) todos = [];
  todos.push(req.body);
  user.updateTodos(todos);
  user.writeTodos();
});
app.post('/editTodo.html', (req, res) => {
  console.log(utility.getPOSTRequests(req.url));
  let date = " " + req.body.date + " ";
  let todos = user.Todos;
  todos.forEach((element) => {
    if (date == element.date) todo.setCurrentTodo(element);
  });
  let currentTodoIndex = todos.indexOf(todo.getCurrentTodo());
  todos[currentTodoIndex] = req.body;
  user.updateTodos(todos);
  user.writeTodos();
});

app.post('/editTodos.html', handlers.getSelectedTodo);
app.post('/viewTodos.html', handlers.getSelectedTodo);
app.post('/deleteTodos.html', handlers.getSelectedTodo);
app.post('/viewTodo.html', (req, res) => {
  console.log(utility.getPOSTRequests(req.url));
  let date = " " + req.body.date + " ";
  let todos = user.Todos;
  todos.forEach((element) => {
    if (date == element.date) todo.setCurrentTodo(element);
  });
  let currentTodoIndex = todos.indexOf(todo.getCurrentTodo());
  todos[currentTodoIndex] = req.body;
  user.updateTodos(todos);
});

app.post('/editTodos.html', getSelectedTodo);
app.post('/viewTodos.html', getSelectedTodo);
app.post('/deleteTodos.html', getSelectedTodo);
app.post('/viewTodo.html', (req, res) => {
  console.log(utility.getPOSTRequests(req.url));
  let date = " " + req.body.date + " ";
  let todos = user.Todos;
  todos.forEach(element => {
    if (date == element.date) todo.setCurrentTodo(element);
  });
  let currentTodoIndex = todos.indexOf(todo.getCurrentTodo());
  currentUserTodos[currentTodoIndex] = req.body;
});
app.post('/deleteTodo.html', (req, res) => {
  console.log(utility.getPOSTRequests(req.url));
  let date = " " + req.body.date + " ";
  let todos = user.Todos;
  todos.forEach(element => {
    if (date == element.date) todo.setCurrentTodo(element);
  });
  let currentTodoIndex = todos.indexOf(todo.getCurrentTodo());
  todos.splice(currentTodoIndex, 1);
  user.updateTodos(todos);
  user.writeTodos();
});
module.exports = app;
