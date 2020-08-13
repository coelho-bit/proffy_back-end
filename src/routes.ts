import express from 'express';
import ConnectionController from './controllers/ConnectionsController';
import UserController from './controllers/UserController';
import TeachersController from './controllers/TeacherController';

const routes = express.Router();
const userController = new UserController();
const teacherController = new TeachersController();
const connectionsController = new ConnectionController();

routes.get('/users', userController.index);
routes.post('/users', userController.create);
routes.post('/login', userController.authenticate);

routes.get('/teachers', teacherController.index);

routes.get('/connections', connectionsController.index);
routes.post('/connections', connectionsController.create);

export default routes;