let webApp = require('./webapp.js');
const fs = require('fs');
let getFileData = require('./lib/utils.js').getFileData;
let getMIMEType = require('./lib/utils.js').getMIMEType;
let timeStamp= require('./lib/time.js').timeStamp;
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
let requestFileHandler = (req, res) => {
  let fileName = `./public${req.url}`;
  let fileData = getFileData(fs, fileName);
  res.setHeader('Content-Type', getMIMEType(req.url));
  res.write(fileData);
  res.end();
};
const loginHandler=(req,res)=>{
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
let app = webApp.create();
app.use(logRequests);
app.get('/', (req, res) => res.redirect('/login.html'));
app.get('/login.html', loginHandler);
app.get('/addTodo.html', requestFileHandler);
app.get('/editTodo.html', requestFileHandler);
app.get('/editTodoItem.html', requestFileHandler);
app.get('/homepage.html', requestFileHandler);
app.get('/viewTodo.html', requestFileHandler);
app.post('/login.html', (req, res) => {
  let user = validUsers.find(u => u.name == req.body.userName);
  if (!user) {
    res.setHeader('Set-Cookie', `logInFailed=true; Max-Age=5`);
    res.redirect('/login.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie', `sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/homepage.html');
});
app.get('/logout',(req,res)=>{
  res.setHeader('Set-Cookie', `sessionid=0; Expires=${new Date(1).toUTCString()}`);
  res.redirect('/login.html');
});
module.exports = app;
