import {Router } from 'express';
import {createBehaviourTest,getBehaviourTest,updateBehaviouralTestResponse,updatedBehaviourShortlistedEmails} from '../../controller/recruiterControllers/behaviouralTest.controller.js';
import protectedRecruiter from '../../middleware/recruiter.middleware.js';
import { getbehavioralInterviewDashboard } from '../../controller/recruiterControllers/currentInterviews/behaviouralInterviewDashboard.controller.js';

const router = Router();

router.post('/create-behaviour-test', protectedRecruiter, createBehaviourTest);
router.post('/get-behaviour-test', getBehaviourTest);
router.post('/get-dashboard-behaviour-test', getbehavioralInterviewDashboard);
router.patch('/updateBehaviouralTestResponse', updateBehaviouralTestResponse);
router.patch('/updateBehaviouralShortlistedEmails', updatedBehaviourShortlistedEmails);
export default router;