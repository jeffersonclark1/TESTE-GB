const bcrypt = require('bcryptjs');
const Sales = require('../models/vendas');
const jwt = require('jsonwebtoken');

const { 
    SECRET
} = process.env;

const Index = {

    hashPassword : async function(password) {
        try {

            return bcrypt.hashSync(password, 8, function(err, hash) {
                return hash
            });

        } catch (error) {
            console.log(error);
        }
    },

    validarCPF : function(cpf) {
        // Limpa cpf
        cpf = cpf.replace(/(\.|\-)/g,'');
    
        let soma = 0;
        let resto;
    
        if (cpf == "00000000000") return false;
        if (cpf == "11111111111") return false;
        if (cpf == "22222222222") return false;
        if (cpf == "33333333333") return false;
        if (cpf == "44444444444") return false;
        if (cpf == "55555555555") return false;
        if (cpf == "66666666666") return false;
        if (cpf == "77777777777") return false;
        if (cpf == "88888888888") return false;
        if (cpf == "99999999999") return false;
        if (cpf == "00000000000") return false;
    
        for (let i=1; i<=9; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
        resto = (soma * 10) % 11;
    
        if ((resto == 10) || (resto == 11))  resto = 0;
        if (resto != parseInt(cpf.substring(9, 10)) ) return false;
    
        soma = 0;
        for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
        resto = (soma * 10) % 11;
    
        if ((resto == 10) || (resto == 11))  resto = 0;
        if (resto != parseInt(cpf.substring(10, 11) ) ) return false;
        return true;
    },

    verifyPassword: async function(password, user) {
        try {
            return bcrypt.compareSync(password, user.pwd);
        } catch (error) {
            console.log(error);
        }
    },

    tokenMiddleware: async (req, res, next) => {

        const token = req.headers['token'];
    
        if (token) {
    
            jwt.verify(token, SECRET, async (err, decoded) => {
    
                if (err) {
                    console.log(err);
                    res.status(403).send({
                        success: false,
                        message: 'Token inválido'
                    });
                } else {
                    if (decoded.password_valid) {
                        next();
                    } else {                        
                        res.status(403).send({
                            success: false,
                            message: 'Senha não validada'
                        });
                    }
                }
            });
        } else {
            next();
            res.status(403).send({
                message: "Token não informado"
            });
        }
    },

    numberFormat: (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },

    validateFields: (body, fieldsBody) => {
        if(body && fieldsBody){
            for (const prop in fieldsBody) {

                if( fieldsBody[prop].type && body[prop] === "") throw new Error (`${prop} is required`);

                if( (typeof body[prop]) !== fieldsBody[prop].type) throw new Error (`${prop} field must be ${fieldsBody[prop].type}`);

            }
        }
    }
    
};

module.exports = Index;