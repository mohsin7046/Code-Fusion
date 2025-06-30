import {Router } from 'express';
import {createJob,createOnlineTest,getOnlineTest,updateOnlineTestResponse,updateOnlineShortListedEmails} from '../../controller/recruiterControllers/onlineTest.controller.js';
import protectedRecruiter from '../../middleware/recruiter.middleware.js';
import { currentInterviewData,getOnlineTestDashboard } from '../../controller/recruiterControllers/currentInterviews/onlineTestDashboard.controller.js';
import { allInterviews } from '../../controller/recruiterControllers/allInterviews/allInterviews.controller.js';

const router = Router();

router.post('/create-job',protectedRecruiter, createJob);
router.post('/create-online-test',protectedRecruiter, createOnlineTest);
router.post('/get-online-test', getOnlineTest);
router.patch('/updateOnlineTestResponse', updateOnlineTestResponse);
router.patch('/updateOnlineShortListedEmails', updateOnlineShortListedEmails);

// current interview data route
router.post('/current-interview-data', currentInterviewData);
router.post('/getOnlineTestData', getOnlineTestDashboard);

// all interviews route
router.post('/all-interviews-data', allInterviews);
export default router;