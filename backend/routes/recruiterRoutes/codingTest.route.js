import {Router} from 'express'
import { codeFeedback, createCodingTest} from '../../controller/recruiterControllers/codingTest.controller.js'
import {getCodingTestDashboard,} from '../../controller/recruiterControllers/currentInterviews/codingTestDashboard.js'
const router = Router();

router.post('/createCodingTest',createCodingTest);
router.post('/getCodingTestDashboard',getCodingTestDashboard);
router.post('/codeFeedback',codeFeedback);
export default router;