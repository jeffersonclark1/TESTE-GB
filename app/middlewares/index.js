const logger = require('../utils/logger');

const Middlewares = {
    HeadersMiddleware(req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'token, content-type');
        next();
    },

    LogMiddleware(req, res, next){
        req.logger = new logger(req.header('RID'));
        req.logger.logRequest(req);
    
        const originalSend = res.send;
        res.send = function() {
            req.logger.logResponse(req, res);
            originalSend.apply(this, arguments);
        };
        next();
    }
}


module.exports = Middlewares;