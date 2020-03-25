'use strict';
// Importo a validação dos campos
const ValidationContract = require("../validators/validators.js");
// Importo a o repoositorio do arquivo
const repository = require("../repositories/customer-repositories");
// Importo MD5
const md5 = require('md5');
// Importo serviço de email
const emailService = require('../services/email-service');
const authService = require('../services/auth-service');

// Método para inserir clientes
exports.post = ('/', async(req, res, next) => {
    // Instancio a validação
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.isEmail(req.body.email, 'E-mail inválido');
    contract.hasMinLen(req.body.senha, 8, 'A senha deve conter pelo menos 3 caracteres');

    // Se os dados forem inválidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }
    try{
        // Pego os dados do request, junto com os campos definidos
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            senha: md5(req.body.senha + global.SALT_KEY)
        });
        emailService.send(req.body.email, "Bem vindo a API em node JS", global.EMAIL_TMPL.replace('{0}', req.body.name));
 
        res.status(201).send({message: "Cliente cadastrado com sucesso!"});
    }
    catch(e){
        // Deu ruim geral
        res.status(500).send({
            message: "Falha ao processar a solicitação!"
        });
    }

});
exports.authenticate = async(req, res, next) => {
    try {
        const customer = await repository.authenticate({
            email: req.body.email,
            senha: md5(req.body.senha + global.SALT_KEY)
        });

        if (!customer) {
            res.status(404).send({
                message: 'Usuário ou senha inválidos'
            });
            return;
        }

        const token = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            token: token,
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};
exports.refreshToken = async(req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        const data = await authService.decodeToken(token);

        const customer = await repository.getById(data.id);

        if (!customer) {
            res.status(404).send({
                message: 'Cliente não encontrado'
            });
            return;
        }

        const tokenData = await authService.generateToken({
            id: customer._id,
            email: customer.email,
            name: customer.name,
            roles: customer.roles
        });

        res.status(201).send({
            token: token,
            data: {
                email: customer.email,
                name: customer.name
            }
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar sua requisição'
        });
    }
};