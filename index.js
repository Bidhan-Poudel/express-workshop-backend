// Filename: index.js




//  * Importing packages
//  */



const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config()

// Import routes from routes/index.js
const router = require('./routes');

const {
    NODE_ENV,
    DEV_MONGO_URL,
    PROD_MONGO_URL,
    PORT,
} = process.env;

// Initialize express
const app = express();

// Parses the json data from request body
app.use(express.json());

// Parses the query params from request url
app.use(express.urlencoded({ extended: true }));

// Uses imported routes in express
app.use('/', router);

mongoose.connect(NODE_ENV==='development'?DEV_MONGO_URL:PROD_MONGO_URL)
  .then(() => {
      console.log('Database connected');
  })
  .catch((err) => {
      console.log(err);
  });

// Listen web requests on 8000 port


const port = PORT || 8000;
app.listen(port, () => {
    console.log('App listening on port localhost',port);
});