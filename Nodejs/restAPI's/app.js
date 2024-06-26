const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const feedRoutes = require('./routes/feed');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);

mongoose.connect('mongodb+srv://varunkatela04:crFy42F2KntYy0p8@cluster2.uc7y68z.mongodb.')
  .then(result => {
    app.listen(8080, () => {
      console.log('Server Connected!!');
    });
  })
  .catch(err => console.log(err));