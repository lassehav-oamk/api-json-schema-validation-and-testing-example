const express = require('express')
const bodyParser = require('body-parser')
const Ajv = require('ajv').default;
const { response } = require('express');
const exampleJsonSchema = require('./schemas/exampleWeatherDataSchema.json');
const app = express()
const port = 3000

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200);
  res.send('Hello World!')
})

/*
  {
    stationId: 249578,
    measurementData: {
      temperature: -15.8,
      humidity: 34.5,
      windSpeed: 0.0
    },
    measurementTime: "2020-01-25T00:00:00"
  }
*/
app.post('/test', (req, res) => {
  const ajv = new Ajv();
  const validate = ajv.compile(exampleJsonSchema);
  const valid = validate(req.body);
  if(valid == true) {
    res.send("OK");
  } else {
    //console.log(validate.errors);
    res.status(400);
    res.send(validate.errors.map(e => e.message));
  }
});

app.post('/users', (req, res) => {
  const ajv = new Ajv();
  const validate = ajv.compile(require('./schemas/userCreateSchema.json'));
  const valid = validate(req.body);
  if(valid == true) {
    // Do something to create the user and save the information

    res.status(201);
    res.json({
      id: 678696
    })
  } else {
    res.status(400);
    res.send(validate.errors.map(e => e.message));
  }
})

let serverInstance = null;

module.exports = {
  start: function() {
    serverInstance = app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })
  },
  close: function() {
    serverInstance.close();
  },
}