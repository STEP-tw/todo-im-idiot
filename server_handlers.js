let serverHandlers={};
let utility=require('./lib/utils.js');
const fs = require('fs');
serverHandlers.requestFileHandler = (req, res) => {
  console.log(utility.getGETRequests(req.url));
  utility.sendRequestedFile(fs, req.url, res,'utf8');
};
serverHandlers.requestImageHandler = (req, res) => {
  console.log(utility.getGETRequests(req.url));
  utility.sendRequestedFile(fs, req.url, res);
};
serverHandlers.loginHandler = (req, res) => {
  let fileData = utility.getRequestedFileData(fs, req.url, res).toString();
  if (req.cookies.logInFailed) res.write(fileData.replace('LOGIN MESSAGE', 'LOGIN FAILED'));
  else res.write(fileData.replace('LOGIN MESSAGE', ''));
  res.end();
};
module.exports=serverHandlers;
