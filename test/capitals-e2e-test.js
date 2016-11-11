const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);
const app = require('../lib/app');
const request = chai.request(app);

describe('Capitals route', () => {

  let token1 = '';
  let token2 = '';

  before(done => {
    request
      .post('/api/auth/signup')
      .send({ username: 'testU3', password: 'testPW'})
      .then(res => assert.ok(token1 = res.body.token))
      .then(done, done);
  });

  it('Denies non-admin access', done => {
    request
      .get('/api/capitals')
      .set('authorization', token1)
      .then(res => done('Should not have 200 response'))
      .catch(res => {
        assert.equal(res.status, 400);
        assert.equal(res.response.body.error, 'Not authorized.');
        done();
      });
  });

  let adminUser = {
    username: 'David Bowie',
    password: 'Starman',
    roles: ['admin', 'starman']
  };

  it('Accepts admin access', done => {
    request
      .post('/api/auth/signup')
      .send(adminUser)
      .then(res => token2 = res.body.token)
      .then(() => {
        request
          .get('/api/capitals')
          .set('authorization', token2)
          .then(res => {
            assert.equal(res.status, 200);
            done();
          })
          .catch(done);
      })
      .catch(done);
  });


});