require('dotenv').config(); 

const express    	 = require('express');
const app        	 = express();
const mongoose   	 = require('mongoose');
const { LogMiddleware, HeadersMiddleware } = require('./app/middlewares');

const { 
    HTTP_PORT, DATABASE_MONGO
} = process.env;

const url = DATABASE_MONGO;

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to the database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })

app.use(express.json());

app.use(HeadersMiddleware);

// app.use(LogMiddleware);

const rotas = require('./app/routes/')(express);
app.use(rotas);

app.listen(HTTP_PORT);

console.log(`GP Gamificações ${HTTP_PORT}`);