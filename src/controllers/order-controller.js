'use strict';

// Importo a validação dos campos
const ValidationContract = require("../validators/validators.js");
// Importo a o repoositorio do arquivo
const repository = require("../repositories/order-repositories");
// Importo guid (Para gerar números randomicos)
const guid = require('guid');

const authService = require('../services/auth-service');

// Método Get, extrair dados 
exports.get = async(req, res, next) => {
    try{
        let data = await repository.get();
        res.status(200).send(data);
    }catch(e){
        res.status(500).send({
            message: "Falha ao processar sua solicitação."
        })
    }
}
// Método Post, inserir dados
exports.post = ('/', async(req, res, next) => {

    // let contract = new ValidationContract();
    // contract.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
    // contract.isEmail(req.body.email, 'E-mail inválido');
    // contract.hasMinLen(req.body.senha, 8, 'A senha deve conter pelo menos 3 caracteres');

    // Se os dados forem inválidos
    // if (!contract.isValid()) {
    //     res.status(400).send(contract.errors()).end();
    //     return;
    // }

    try{
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        await repository.create({
            customer: data.id,
            number: guid.raw().substring(0, 6),
            items: req.body.items
        });
        res.status(201).send({message: "Pedido cadastrado com sucesso!"});
    }
    catch(e){
        res.status(500).send({
            message: "Falha ao processar a solicitação!" + e
        });
    }

});