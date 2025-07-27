import {createSchedule,getSchedule,createTestSchedule} from '../../controller/recruiterControllers/automationTest/timelySchedule.controller.js';
import { createCurrentSchedule } from '../../controller/recruiterControllers/automationTest/currentSchedule.controller.js';
import {Router } from 'express';

const router = Router();
router.post('/createSchedule', createSchedule);
router.post('/getSchedule', getSchedule);
router.post('/createTestSchedule', createTestSchedule);

router.get('/currentSchedule/:status/:jobId', createCurrentSchedule);

export default router;