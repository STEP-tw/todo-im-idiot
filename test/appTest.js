let chai = require('chai');
let assert = chai.assert;
let app = require('../app.js');
let request=require('./requestSimulator.js')
describe('app',()=>{
  describe('GET /bad',()=>{
    it('responds with 404',done=>{
      request(app,{method:'GET',url:'/bad'},(res)=>{
        assert.equal(res.statusCode,404);
        done();
      })
    })
  }) 
})
