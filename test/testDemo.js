const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));
chai.use(require('chai-json-schema-ajv'))
const server = require('../server');
const apiAddress = "http://localhost:3000";
const userCreatedSchema = require('./schemas/userCreated.json');

describe('Demonstration of tests', function() {
  before(function () {
    // start the server
    server.start();
  });

  after(function () {
    // close the server
    server.close();
  })

  describe('Testing route /', function() {

    it('Should return successfull response', async function() {

      // prepare http request
      // send the request to our server
      await chai.request(apiAddress).get('/')
        .then(response => {
          expect(response).to.have.status(200);
        })
        .catch(error => {
          throw error;
        })
    })
  })

  describe('Testing route /test', function() {

    it('Should return status 200 with correct request', async function() {
      await chai.request(apiAddress)
        .post('/test')
        .send({
          stationId: 249578,
          measurementData: {
            temperature: -15.8,
            humidity: 34.5,
            windSpeed: 0.0
          },
          measurementTime: "2020-01-25T00:00:00"
        })
        .then(response => {
          expect(response.status).to.equal(200);
        })
        .catch(error => {
          throw error
        });
    })

    it('Should return status 400 with missing fields in request body', async function() {
      await chai.request(apiAddress)
        .post('/test')
        .send({
          stationId: 249578,
          measurementTime: "2020-01-25T00:00:00"
        })
        .then(response => {
          expect(response.status).to.equal(400);
        })
        .catch(error => {
          throw error
        });
    })
  })

  describe('User registration tests', function() {
    it('should reject (status 400) the request if fields are missing', async function() {
      await chai.request(apiAddress)
        .post('/users')
        .send({
          username: "foo"
        })
        .then(response => {
          expect(response.status).to.equal(400);
        })
        .catch(error => {
          throw error
        });

      await chai.request(apiAddress)
        .post('/users')
        .send({
          password: "foo"
        })
        .then(response => {
          expect(response.status).to.equal(400);
        })
        .catch(error => {
          throw error
        });
    });

    it('should reject (status 400) the request if username is empty', async function() {
      await chai.request(apiAddress)
        .post('/users')
        .send({
          username: "",
          password: "123456"
        })
        .then(response => {
          expect(response.status).to.equal(400);
        })
        .catch(error => {
          throw error
        });
    });
    it('should reject (status 400) the request if password is too short(6 chars)', async function() {
      await chai.request(apiAddress)
        .post('/users')
        .send({
          username: "foobar",
          password: "123"
        })
        .then(response => {
          expect(response.status).to.equal(400);
        })
        .catch(error => {
          throw error
        });
    })
    it('should response with user ID if all information is correct', async function() {
      await chai.request(apiAddress)
        .post('/users')
        .send({
          username: "foobar",
          password: "123456"
        })
        .then(response => {
          expect(response.status).to.equal(201);
          // validate response body with JSON Schema
          expect(response.body).to.be.jsonSchema(userCreatedSchema);
        })
        .catch(error => {
          throw error
        });
    })
  })
})