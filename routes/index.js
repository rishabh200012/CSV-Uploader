import express from 'express';
import homeController from '../controllers/home_controller.js';
import filesRouter from './files.js';

const router = express.Router();

console.log('router loaded');

const controller=new homeController();

router.get('/', controller.home);

router.use('/file', filesRouter);
router.use('/show', filesRouter);
router.use('/delete', filesRouter);

export default router;
