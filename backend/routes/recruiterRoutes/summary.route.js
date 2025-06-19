import {Router } from 'express';
import {createSummary,getSummary} from '../../controller/recruiterControllers/summary.controller.js';
import protectedRecruiter from '../../middleware/recruiter.middleware.js';
const router = Router();

router.post('/create-summary', createSummary);
router.post('/get-summary', getSummary);

export default router;