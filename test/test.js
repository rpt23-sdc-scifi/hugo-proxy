var app = require('../server');
var chai = require('chai');
var request = require('supertest');
var should = chai.should();

describe('Get initial songData', () => {
  it('Should GET songData associated with songID = 1', () => {
    request(app)
      .get('/songdata/1')
      .set('Accept', 'application/json')
      .expect((res) => {
        res.body.songID.should.be.eql(1);
      })
      .expect(200);
  })
});

describe('Test songIDs that do not exist', () => {
  it('Should NOT GET songData associated with songID = 0', () => {
    request(app)
    .get('/songdata/0')
    .expect((res) => {
      res.body.songID.should.be.eql(undefined);
    })
    .expect(400);
  })
});

describe('Test that /songdata/ does not take POST requests', () => {
  it('Should NOT POST anything to the DB', () => {
    request(app)
    .post('/songdata/')
    .expect(400)
  })
})