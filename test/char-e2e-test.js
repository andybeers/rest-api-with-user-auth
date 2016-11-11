const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

const connection = require('../lib/setup-mongoose');
const app = require('../lib/app');
const request = chai.request(app);

describe('RESTful API for characters resource', () => {

  let token = '';

  before(done => {
    request
      .post('/api/auth/signup')
      .send({ username: 'testU2', password: 'testPW'})
      .then(({ body }) => {
        assert.ok(token = body.token);
        done();
      });
  });

  const char1 = {
    name: 'Darth Vader',
    forceUser: false,
    shipId: null
  };
  const char2 = {
    name: 'Darth Vader',
    forceUser: true,
    shipId: null,
    __v: 0
  };
  const ship1 = {
    name: 'Tantive IV',
    type: 'Corellian Corvette',
    lengthMeters: 100
  };

  it('Starts with empty collection', done => {
    request
      .get('/api/characters')
      .set('authorization', token)
      .then(res => {
        assert.deepEqual(res.body, []);
        done();
      })
      .catch(done);
  });

  it('Adds a character to the collection', done => {
    request
      .post('/api/ships')
      .set('authorization', token)
      .send(ship1)
      .then(res => {
        char1.shipId = res.body._id;
        char2.shipId = res.body._id;
        request
          .post('/api/characters')
          .set('authorization', token)
          .send(char1)
          .then(res => {
            const resChar = res.body;
            assert.ok(resChar._id);
            char1._id = resChar._id;
            char1.__v = 0;
            char1.shipId = resChar.shipId;
            done();
          })
          .catch(done);
      })
      .catch(done);
  });

  it('Gets character by Id', done => {
    request
      .get(`/api/characters/${char1._id}`)
      .set('authorization', token)
      .then(res => {
        const resChar = res.body;
        char1.shipId = resChar.shipId;
        assert.deepEqual(resChar, char1);
        done();
      })
      .catch(done);
  });

  it('Gets all characters', done => {
    request
      .get('/api/characters')
      .set('authorization', token)
      .then(res => {
        assert.isArray(res.body);
        done();
      })
      .catch(done);
  });

  it('Updates a character with PUT', done => {
    request
      .put(`/api/characters/${char1._id}`)
      .set('authorization', token)
      .send(char2)
      .then(res => {
        char2._id = char1._id;
        char2.shipId = char1.shipId;
        assert.deepEqual(res.body, char2);
        done();
      })
      .catch(done);
  });

  it('Removes a character with DELETE', done => {
    request
      .delete(`/api/characters/${char1._id}`)
      .set('authorization', token)
      .then(() => {
        request
          .get('/api/characters')
          .set('authorization', token)
          .then(res => {
            assert.equal(res.body.length, 0);
            done();
          })
          .catch(done);
      })
      .catch(done);
  });
  
});