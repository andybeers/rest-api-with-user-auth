const Ship = require('../lib/models/ship');
const Character = require('../lib/models/character');
const assert = require('chai').assert;

describe('Ship model', () => {

  it('Validates with name, type, and length', done => {

    const ship = new Ship({
      name: 'Millenium Falcon',
      type: 'Smuggling Vessel',
      lengthMeters: 34.75
    });
    ship.validate(err => {
      if (!err) done();
      else done(err);
    });

  });

  it('Requires name', done => {

    const ship = new Ship({
      type: 'Fighter',
      lengthMeters: 50
    });
    ship.validate(err => {
      assert.isOk(err, 'Name is required.');
      done();
    });

  });

  it('Sets default type to unkown', done => {

    const ship = new Ship({
      name: 'Tantive IV',
      lengthMeters: 540
    });
    ship.validate(err => {
      assert.isNotOk(err);
      assert.equal(ship.type, 'Unknown');
      done();
    });

  });

});

describe('Character model', () => {

  it('Validates with name, forceUser, and shipId', done => {

    const character = new Character({
      name: 'Luke Skywalker',
      forceUser: true,
      shipId: '5821049133ced6e059832bd5'
    });
    character.validate(err => {
      if (!err) done();
      else done(err);
    });

  });

  it('Name is required', done => {

    const character = new Character({
      forceUser: false
    });
    character.validate(err => {
      assert.isOk(err, 'Name is required.');
      done();
    });

  });
  
});

