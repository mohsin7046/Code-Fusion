import {Router } from 'express';
import {createBehaviourTest,getBehaviourTest} from '../../controller/recruiterControllers/behaviouralTest.controller.js';
import protectedRecruiter from '../../middleware/recruiter.middleware.js';
const router = Router();

router.post('/create-behaviour-test', protectedRecruiter, createBehaviourTest);
router.post('/get-behaviour-test', getBehaviourTest);
export default router;