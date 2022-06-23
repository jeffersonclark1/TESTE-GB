# Desafio

## _Eu revendedor ‘O Boticário’ quero ter benefícios de acordo com o meu volume de vendas._

## Features

- Rota para cadastrar um novo revendedor(a) exigindo no mínimo nome completo, CPF,
e- mail e senha;
- Rota para validar um login de um revendedor(a);
- Rota para cadastrar uma nova compra exigindo no mínimo código, valor, data e CPF do
revendedor(a). Todos os cadastros são salvos com o status “Em validação” exceto
quando o CPF do revendedor(a) for 153.509.460-56, neste caso o status é salvo como
“Aprovado”;
- Rota para listar as compras cadastradas retornando código, valor, data, % de cashback
aplicado para esta compra, valor de cashback para esta compra e status;
- Rota para exibir o acumulado de cashback até o momento, essa rota irá consumir essa
informação de uma API externa disponibilizada pelo Boticário.

## Premissas do caso de uso:

### Os critérios de bonificação são:
- Para até 1.000 reais em compras, o revendedor(a) receberá 10% de cashback do
valor vendido no período de um mês (sobre a soma de todas as vendas);
- Entre 1.000 e 1.500 reais em compras, o revendedor(a) receberá 15% de cashback
do valor vendido no período de um mês (sobre a soma de todas as vendas);
- Acima de 1.500 reais em compras, o revendedor(a) receberá 20% de cashback do
valor vendido no período de um mês (sobre a soma de todas as vendas).

> Requisitos técnicos obrigatórios:

- Utilize umas destas linguagens: Nodejs ou Python;

- Banco de dados relacional ou não relacional;

## Instalação 
```sh 
  nvm use 14
  npm i
  node server.js
```

## Como utilizar API

> Criar usuário 
- rota /create/user

Requisição
```sh 
Método: POST
Payload:
{
  "name" : "Jefferson Souza",
  "document" : "47678865899",
  "email": "jeffersonclarkti@gmail.com",
  "password": "123456789"
}
```

Retorno
```sh 
{
  "date_document": "2022-06-23T18:24:56.000Z",
  "_id": "62b4b11264d6b3779b94d69e",
  "name": "Jefferson Souza",
  "document": "47678865899",
  "email": "jeffersonclarkti@gmail.com",
  "pwd": "$2a$08$cqbrOnN4rEXoWE1jpX61ZuE93xyKnHTGs2Yq69iqEKOQlKyKfc4V."
}
```

> Autenticar 
- rota /auth

Requisição
```sh
Método: POST
Payload:
{
  "document" : "63887278755",
  "password": "123456789"
}
```

Retorno
```sh 
{
  "message": "Bem vindo novamente ao sistema Jefferson Souza",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmI0NjUwNjIwM2RjMzIyYzI3ODAyMDkiLCJwYXNzd29yZF92YWxpZCI6dHJ1ZSwiaWF0IjoxNjU2MDA5MDcyLCJleHAiOjE2NTYxMTcwNzJ9.QapNqm1R86ese4_WFNbYd42k-Tc0vfSTU_CEwQN5jRM"
}
```
Salve o token que vem na resposta para consumir os serviços da API;


> Registrar vendas 
- rota /store/sales

Requisição
```sh 
Método: POST
Payload:
{
  "code": "0001",
  "value": 50,
  "date": "2022-09-22",
  "document": "15350946056"
}
```
Informar o token no Headers
```sh 
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmI0NjUwNjIwM2RjMzIyYzI3ODAyMDkiLCJwYXNzd29yZF92YWxpZCI6dHJ1ZSwiaWF0IjoxNjU2MDA5MDcyLCJleHAiOjE2NTYxMTcwNzJ9.QapNqm1R86ese4_WFNbYd42k-Tc0vfSTU_CEwQN5jRM", // TOKEN DE EXEMPLO
}
```

Retorno
```sh 
{
  "sales": [
    {
        "code": "0001",
        "value": 50,
        "date": "2022-09-22",
        "period": "09-2022",
        "status": "Aprovado"
    }
  ],
  "date_document": "2022-06-23T18:24:56.000Z",
  "_id": "62b4b1f364d6b3779b94d6a5",
  "document": "15350946056",
  "__v": 0
}
```

> Acumulo de cashback 
- rota /get/accumulation/cashback

Requisição
```sh 
Método: GET
Payload: não precisar informar nenhum parametro.
```
Informar o token no Headers
```sh 
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmI0NjUwNjIwM2RjMzIyYzI3ODAyMDkiLCJwYXNzd29yZF92YWxpZCI6dHJ1ZSwiaWF0IjoxNjU2MDA5MDcyLCJleHAiOjE2NTYxMTcwNzJ9.QapNqm1R86ese4_WFNbYd42k-Tc0vfSTU_CEwQN5jRM", // TOKEN DE EXEMPLO
}
```

Retorno
```sh 
{
  "cashbackAcumulado": 1285
}
```

> Vendas  
- rota /get/sales

Requisição
```sh 
Método: GET
Payload: não precisar informar nenhum parametro.
```
Informar o token no Headers
```sh 
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmI0NjUwNjIwM2RjMzIyYzI3ODAyMDkiLCJwYXNzd29yZF92YWxpZCI6dHJ1ZSwiaWF0IjoxNjU2MDA5MDcyLCJleHAiOjE2NTYxMTcwNzJ9.QapNqm1R86ese4_WFNbYd42k-Tc0vfSTU_CEwQN5jRM", // TOKEN DE EXEMPLO
}
```

Retorno
```sh 
[
  {
    "document": "15350946056",
    "sales": [
      {
        "itens": [
          {
            "code": "0001",
            "value": 50,
            "date": "2022-09-22",
            "period": "09-2022",
            "status": "Aprovado",
            "valorCashback": 5
          }
        ],
        "periodo": "09-2022",
        "cashback": "10",
        "totalVendas": 50
      }
    ]
  }
]
```

## License

MIT

**Jefferson Clark**
