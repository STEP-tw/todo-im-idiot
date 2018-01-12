let webApp=require('./webapp.js');
const fs=require('fs');
let getFileData=require('./lib/utils.js').getFileData;
let getMIMEType=require('./lib/utils.js').getMIMEType;
let app=webApp.create();
app.get('/',(req,res)=>res.redirect('/login.html'));
app.get('/login.html',(req,res)=>{
  let fileName=`./public${req.url}`;
  let fileData=getFileData(fs,fileName);
  res.setHeader('Content-Type',getMIMEType(req.url));
  res.write(fileData);
  res.end();
});
module.exports=app;
