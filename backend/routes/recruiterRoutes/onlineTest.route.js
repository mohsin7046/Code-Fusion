import {Router } from 'express';
import {createJob,createOnlineTest} from '../../controller/recruiterControllers/onlineTest.controller.js';
import protectedRecruiter from '../../middleware/recruiter.middleware.js';
const router = Router();

router.post('/create-job',protectedRecruiter, createJob);
router.post('/create-online-test',protectedRecruiter, createOnlineTest);

export default router;