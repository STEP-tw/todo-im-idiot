let PORT=8000;
let HOST='127.0.0.1';
let app=require('./app.js');
const http = require('http');
const server=http.createServer(app);
server.listen(PORT,HOST,()=> console.log(`Serving on ${HOST} : ${PORT}`));
