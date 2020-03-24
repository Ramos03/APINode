'use strict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');

exports.get = (req, res, next) =>{
    Product
        .find({
            active: true
        }, 'title price slug')
        .then(data=> {
            res.status(200).send(data);
        }).catch(e =>{
            res.status(400).send(e);
        });
}

exports.post = ('/', (req, res, next) => {
    let product = new Product(req.body);
    product
        .save()
        .then(x=>{
            res.status(201).send({
                message: "Produto cadastrado com sucesso!"
            });
        }).catch(e =>{
            res.status(400).send({
                message: "Falha ao cadastrar o produto",
                data: e
            });
        });

});

exports.put = ('/:id', (req, res, next) => {
    let id = req.params.id;
    res.status(201).send({ id: id, item: req.body });
});

exports.delete = ('/:id', (req, res, next) => {
    res.status(200).send(req.body);;
});
