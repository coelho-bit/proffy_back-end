import express from 'express';
import ConnectionController from './controllers/ConnectionsController';
import UserController from './controllers/UserController';
import TeachersController from './controllers/TeacherController';
import Middleware from './middleware';

const routes = express.Router();
const userController = new UserController();
const teacherController = new TeachersController();
const connectionsController = new ConnectionController();

routes.get('/users', userController.index);
routes.post('/users', userController.create);
routes.post('/login', userController.authenticate);

routes.post('/teachers', Middleware.authorize, teacherController.create);
routes.put('/teachers', Middleware.authorize, teacherController.update);
routes.get('/teachers', teacherController.index);

routes.get('/connections', Middleware.authorize, connectionsController.index);
routes.post('/connections', Middleware.authorize, connectionsController.create);

export default routes;