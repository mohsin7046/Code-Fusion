import {Router } from 'express';
import {createBehaviourTest} from '../../controller/recruiterControllers/behaviouralTest.controller.js';
import protectedRecruiter from '../../middleware/recruiter.middleware.js';
const router = Router();

router.post('/create-behaviour-test', protectedRecruiter, createBehaviourTest);
export default router;