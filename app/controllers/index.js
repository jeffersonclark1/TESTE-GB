const { 
    SECRET,
    CPF,
    API_AWS,
    API_AWS_HEADER,
    CASH10,
    CASH15,
    CASH20
} = process.env;
const User = require('../models/usuario');
const Sales = require('../models/vendas');
const moment = require('moment');
const axios = require('axios');
const Utils = require('../utils');
const jwt = require('jsonwebtoken');

const Controller = {

    create : async function(req, res) {
        try {

            const params = req.body;

            const fieldsBody = {
                "name": {
                  "type": "string",
                  "required": true
                },
                "document": {
                  "type": "string",
                  "required": true
                },
                "email": {
                  "type": "string",
                  "required": true
                },
                "password": {
                  "type": "string",
                  "required": true
                }
            };

            Utils.validateFields(params,fieldsBody);

            if (params.document.length < 11) return res.json({message: `CPF ${params.document} inválido`}).status(406);
            if(!Utils.validarCPF(params.document)) return res.json({message: `CPF ${params.document} inválido`}).status(406);

            if ( params.document == CPF ) return res.json({message: `CPF ${CPF} já está sendo utilizado`}).status(406);

            const verificarUsuario = await User.findOne({document: params.document});
            if(verificarUsuario) return res.status(406).json({message: `CPF ${params.document} já está sendo utilizado`});

            const user = new User();

            user.name = params.name;
            user.document = params.document;
            user.email = params.email;
            user.pwd = await Utils.hashPassword(params.password);
            user.save();

            return res.status(201).json(user);

        } catch (error) {
            return res.status(404).json({message: error.message})
        }
    },

    store : async function(req, res) {
        try {

            const params = req.body;

            const fieldsBody = {
                "code": {
                  "type": "string",
                  "required": true
                },
                "value": {
                  "type": "number",
                  "required": true
                },
                "date": {
                  "type": "string",
                  "required": true
                },
                "document": {
                  "type": "string",
                  "required": true
                }
            };

            Utils.validateFields(params,fieldsBody);

            if( params.document && params.document != CPF ) {
                const validarUsuario = await User.findOne({document: params.document});
                if(!validarUsuario)
                    return res.json({message: `CPF ${params.document} não está sendo localizado na base`}).status(204); 
            }

            let status = "Em validação";

            if ( params.document == CPF ) status = "Aprovado";

            const retorno = req.body;
            retorno.status = status;

            const verificarVendas = await Sales.findOne({document: params.document});

            if(verificarVendas){

                const verificarCodigo = verificarVendas.sales.filter( item => {
                    return item.code == params.code && item.date == params.date;
                });

                if(verificarCodigo.length > 0) return res.json({message: "Esse código já está sendo utilizado nesse mesmo período"}).status(200);

                verificarVendas.sales.push({
                    code: params.code,
                    value: params.value,
                    date: moment().format(params.date),
                    period: moment(params.date).format('MM-YYYY'),
                    status: status,
                });
                await verificarVendas.save();
                return res.status(201).json({data: verificarVendas.document, sales: verificarVendas.sales});
            } else {
                const sales = new Sales();
                sales.document = params.document;
                sales.sales = [
                    {
                        code: params.code,
                        value: params.value,
                        date: moment().format(params.date),
                        period: moment(params.date).format('MM-YYYY'),
                        status: status,
                    }
                ]
                await sales.save();
                return res.status(201).json(sales);
            }

        } catch (error) {
            return res.status(404).json({message: error.message})
        }
    },

    get : async function(req, res) {
        try {

            const settings = {
                "url": API_AWS,
                "method": "GET",
                "headers": {
                    "token": API_AWS_HEADER
                },
            };

            return await axios(settings)
                .then((response) => {
                    if(response.status == 200){
                        const cashback = response.data.body.credit;
                        return res.status(200).json({cashbackAcumulado: cashback});
                    }else {
                        return res.status(404).json({message: "Não foi possivél fazer consulta, tente novamente!"});
                    }
                })
                .catch((err) => {
                    return res.status(404).json({message: "Não foi possível fazer a requisição, tente novamente"});
                })

        } catch (error) {
            return res.status(404).json({message: "Não foi possível fazer a requisição, tente novamente"});
        }
    },

    sales : async function(req, res) {
        try {
            const sales = await Sales.find();
            const retorno = [];
            if(sales.length > 0){
                sales.map( elem => {
                    const periodo = [];
                    const vendas = [];
                    elem.sales.map( s => {
                        // CRIANDO PERIODO SEM DUPLICIDADE
                        const verificar = periodo.filter( c => c.periodo == s.period);
                        if(verificar.length == 0 ) {
                            periodo.push({ periodo: s.period})
                        }
                    });

                    periodo.map( p => {
                        // REGISTROS CONFORME PERIODO
                        const itens = elem.sales.filter( e => e.period == p.periodo)
                        // SOMA DE CADA VENDA
                        const sum = itens.reduce( ( prevVal, elem ) => prevVal + elem.value, 0 );
                        let cashback = 0;
                        // CASHBACK CONFORME QUANTIDADE DE VENDAS
                        if(sum <= 1000){
                            cashback = CASH10;
                        }else if ( sum > 1000 && sum < 1500) {
                            cashback = CASH15;
                        } else if (sum >= 1500 ) {
                            cashback = CASH20;
                        }
                        // APLICAR VALOR DO CASHBACK
                        itens.map( c => {
                            const valorCash = c.value * CASH10 / 100;
                            c.valorCashback = valorCash;
                        })
                        // CRIANDO PERIODO SEM DUPLICIDADE
                        vendas.push({
                            itens,
                            periodo: p.periodo,
                            cashback: cashback,
                            totalVendas: sum
                        })
                    })                    
                    retorno.push({
                        document: elem.document,
                        sales: vendas,
                    })
                });
                
                return res.json(retorno).status(200);
            } else {
                return res.status(404).json({message: "Nenhum registro de vendas foi localizado"});
            }

        } catch (error) {
            return res.status(404).json({message: "Não foi possível fazer a requisição, tente novamente"});
        }
    },  

    auth : async function(req, res) {
        try {
            const params = req.body;
            const user = await User.findOne({document: params.document});
            
            if(user) {
                const verificar = await Utils.verifyPassword(params.password, user);
                if(verificar) {
                    const token = jwt.sign({
                        _id: user._id,
                        password_valid: true
                    },
                        SECRET, {
                        expiresIn: 108000 // expira em 30 minutos
                    });
                    return res.status(201).json({message: `Bem vindo novamente ao sistema ${user.name}`, token: token});
                }
                if(!verificar) return res.status(404).json({message: `Usuário não foi localizado na base`});
            }

        } catch (error) {
            return res.status(404).json({message: "Não foi possível fazer a requisição, tente novamente"});
        }
    }, 
};

module.exports = Controller;