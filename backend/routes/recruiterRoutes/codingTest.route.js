import {Router} from 'express'
import { allAllEmailstoFinalShortlisted, codeFeedback, createCodingTest, shortlistCandidate_Coding} from '../../controller/recruiterControllers/codingTest.controller.js'
import {getCodingTestDashboard} from '../../controller/recruiterControllers/currentInterviews/codingTestDashboard.js'

const router = Router();

router.post('/createCodingTest',createCodingTest);
router.post('/getCodingTestDashboard',getCodingTestDashboard);
router.post('/codeFeedback',codeFeedback);
router.patch('/shortlistCandidate_Coding',shortlistCandidate_Coding);
router.patch('/updateCodingTestShortlistedEmails',allAllEmailstoFinalShortlisted);
export default router;