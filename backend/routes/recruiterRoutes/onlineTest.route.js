import {Router } from 'express';
import {createJob,createOnlineTest,getOnlineTest} from '../../controller/recruiterControllers/onlineTest.controller.js';
import protectedRecruiter from '../../middleware/recruiter.middleware.js';
import { currentInterviewData,getOnlineTestDashboard } from '../../controller/recruiterControllers/currentInterviews/onlineTestDashboard.controller.js';

const router = Router();

router.post('/create-job',protectedRecruiter, createJob);
router.post('/create-online-test',protectedRecruiter, createOnlineTest);
router.post('/get-online-test', getOnlineTest);


// current interview data route
router.post('/current-interview-data', currentInterviewData);
router.post('/getOnlineTestData', getOnlineTestDashboard);
export default router;