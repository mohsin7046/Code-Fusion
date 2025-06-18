import {Router } from 'express';
import {createSummary} from '../../controller/recruiterControllers/summary.controller.js';
import protectedRecruiter from '../../middleware/recruiter.middleware.js';
const router = Router();

router.post('/create-summary', protectedRecruiter, createSummary);
export default router;