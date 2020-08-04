import express from 'express';
import ClassController from './controller/ClassController';


const routes = express.Router();
const classController = new ClassController();

routes.get('/class', classController.index);
routes.post('/class', classController.create);

routes.get('/connection', classController.index);
routes.post('/connection', classController.create);

export default routes;