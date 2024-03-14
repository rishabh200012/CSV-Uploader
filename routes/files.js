import express from 'express';
import homeController from '../controllers/home_controller.js';

const router = express.Router();
const controller=new homeController();

router.post('/upload', controller.uploadFile);
router.get('/filecsv', controller.showFile);
router.get('/deleteFile/:id',controller.deleteFile);

export default router;
