import {Router} from 'express'
import { createCodingTest} from '../../controller/recruiterControllers/codingTest.controller.js'
import {getCodingTestDashboard} from '../../controller/recruiterControllers/currentInterviews/codingTestDashboard.js'

const router = Router();

router.post('/createCodingTest',createCodingTest);
router.post('/getCodingTestDashboard',getCodingTestDashboard);

export default router;