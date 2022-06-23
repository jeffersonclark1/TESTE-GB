const controller = require('../controllers');
const Utils = require('../utils/index')

module.exports = (express) => {

  const apiRouter = express.Router();

  apiRouter.post('/auth', controller.auth);

  apiRouter.post('/create/user', controller.create);

  apiRouter.use(Utils.tokenMiddleware);

  apiRouter.post('/store/sales', controller.store);

  apiRouter.get('/get/accumulation/cashback', controller.get);

  apiRouter.get('/get/sales', controller.sales);  

  return apiRouter;

};