'use strict';

const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const ValidationContract = require("../validators/validators.js");
const repository = require("../repositories/product-repositories.js");

// Método GetAll, Traz todos produtos
exports.get = async(req, res, next) =>{
    try{
        var data = await repository.get();
        res.status(200).send(data);
    } catch(e){
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}
// Método BySlug, traz dados através do slug (/products/'slug')
exports.getBySlug = async(req, res, next) =>{
    try{
        var data = await repository.getBySlug(req.params.slug);
        res.status(200).send(data);
    }
    catch(e){
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}

// Método byId, Traz dados através do ID (/products/admin/'id')
exports.getById = async(req, res, next) =>{
    try{
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    }
    catch(e){
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}
// Método byTag, traz dados através da tag (/products/'tag')
exports.getByTag = async(req, res, next) =>{
    try{
        var data = await repository.getByTag(req.params.tag);
        res.status(200).send(data);
    }
    catch(e){
        res.status(500).send({
            message: "Falha ao processar sua requisição"
        });
    }
}

//Método de inserção de dados
exports.post = ('/', async(req, res, next) => {

    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O título deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.slug, 3, 'O título deve conter pelo menos 3 caracteres');
    contract.hasMinLen(req.body.description, 3, 'O título deve conter pelo menos 3 caracteres');

    // Se os dados forem inválidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    try{
        await repository
        .create(req.body)
            res.status(201).send({message: "Produto cadastrado com sucesso!"});
    }
    catch(e){
        res.status(500).send({
            message: "Falha ao processar a solicitação!"
        });
    }

});
// Método para atualizar
exports.put = ('/:id', async(req, res, next) => {
    try{
        await repository.update(req.params.id, req.body)
        res.status(201).send({message: "Produto atualizado com sucesso!"});
    }
    catch(e){
        res.status(500).send({
            message: "Falha ao processar a solicitação!"
        });
    }
});
// Método para deletar
exports.delete = async(req, res, next) => {
    try{
        await repository.delete(req.body.id)
        res.status(201).send({message: "Produto removido com sucesso!" });
    }
    catch(e){
        res.status(500).send({
            message: "Falha ao processar a solicitação!"
        });
    }

};
