let webApp=require('./webapp.js');
let app=webApp.create();
app.get('/',(req,res)=>{
  if(req.url=="/") res.redirect('/login.html');
});
module.exports=app;
