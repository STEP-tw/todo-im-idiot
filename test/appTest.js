let chai = require('chai');
let assert = chai.assert;
let app = require('../app.js');
let request=require('./requestSimulator.js')
const should_be_redirected_to = (res,location)=>{
  assert.equal(res.statusCode,302);
  assert.equal(res.headers.location,location);
};
const status_is_ok = (res)=>assert.equal(res.statusCode,200);
const content_type_is = (res,expected)=> assert.equal(res.headers['Content-Type'],expected);
const body_contains = (res,text)=> assert.isOk(res.body.includes(text),`missing ${text}`);
const should_not_have_cookie = (res,name)=> {
  let cookieText = res.headers['Set-Cookie']||'';
  assert.notInclude(cookieText,`${name}=`);
};
const should_have_cookie = (res,name,value)=> {
  console.log(res.headers);
  let cookieText = res.headers['Set-Cookie'];
  assert.include(cookieText,`${name}=${value}`);
};
const should_have_expiring_cookie = (res,name,value)=> {
  console.log(res.headers);
  let cookieText = res.headers['Set-Cookie'];
  assert.include(cookieText,`${name}=${value}; Max-Age=5`);
};
describe('app',()=>{
  describe('GET /bad',()=>{
    it('responds with 404',done=>{
      request(app,{method:'GET',url:'/bad'},(res)=>{
        assert.equal(res.statusCode,404);
        done();
      })
    })
  })
  describe('GET /',()=>{
    it('redirects to login.html',done=>{
      request(app,{method:'GET',url:'/'},(res)=>{
        should_be_redirected_to(res,'/login.html');
        assert.equal(res.body,"");
        done();
      })
    })
  })
  describe('GET /login.html',()=>{
    it('gives the login page',done=>{
      request(app,{method:'GET',url:'/login.html'},res=>{
        status_is_ok(res);
        content_type_is(res,'text/html');
        body_contains(res,'LOGIN');
        done();
      })
    })
  })
  describe('GET /addTodo.html',()=>{
    it('gives the addTodo page',done=>{
      request(app,{method:'GET',url:'/addTodo.html'},res=>{
        status_is_ok(res);
        content_type_is(res,'text/html');
        done();
      })
    })
  })
  describe('GET /editTodo.html',()=>{
    it('gives the editTodo page',done=>{
      request(app,{method:'GET',url:'/editTodo.html'},res=>{
        status_is_ok(res);
        content_type_is(res,'text/html');
        done();
      })
    })
  })
  describe('GET /editTodoItem.html',()=>{
    it('gives the editTodoItem page',done=>{
      request(app,{method:'GET',url:'/editTodoItem.html'},res=>{
        status_is_ok(res);
        content_type_is(res,'text/html');
        done();
      })
    })
  })
  describe('GET /homepage.html',()=>{
    it('gives the homepage page',done=>{
      request(app,{method:'GET',url:'/homepage.html'},res=>{
        status_is_ok(res);
        content_type_is(res,'text/html');
        done();
      })
    })
  })
  describe('GET /viewTodo.html',()=>{
    it('gives the viewTodo page',done=>{
      request(app,{method:'GET',url:'/viewTodo.html'},res=>{
        status_is_ok(res);
        content_type_is(res,'text/html');
        done();
      })
    })
  })
  describe('POST /login.html',()=>{
    it('redirects to homepage for valid user',done=>{
      request(app,{method:'POST',url:'/login.html',body:'userName=salmans'},res=>{
        should_be_redirected_to(res,'/homepage.html');
        should_not_have_cookie(res,'message');
        done();
      })
    })
    it('redirects to login.html with message for invalid user',done=>{
      request(app,{method:'POST',url:'/login.html',body:'userName=badUser'},res=>{
        should_be_redirected_to(res,'/login.html');
        should_have_expiring_cookie(res,'logInFailed','true');
        done();
      })
    })
    })
  })
