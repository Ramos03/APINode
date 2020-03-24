'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();
const router = express.Router();

//Connecta ao banco
mongoose.connect("mongodb+srv://vinicius:Vinicius32@apinode-u50zg.mongodb.net/test?retryWrites=true&w=majority");

// Carrega as models
const Product = require('./models/product');

// Carrega as rotas
const indexRoute = require('./routes/index-route');
const productRoute = require('./routes/product-route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', indexRoute);
app.use('/products', productRoute);


module.exports = app;