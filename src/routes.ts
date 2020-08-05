import express from 'express';
import ClassController from './controller/ClassController';
import ConnectionController from './controller/ConnectionController';


const routes = express.Router();
const classController = new ClassController();
const connectionController = new ConnectionController();

routes.get('/class', classController.index);
routes.post('/class', classController.create);

routes.get('/connection', connectionController.index);
routes.post('/connection', connectionController.create);

export default routes;