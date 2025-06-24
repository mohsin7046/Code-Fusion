import {candidateJobApplicationTracking} from '../controller/jobApplication.controller.js';
import {Router} from 'express';

const router = Router();
router.post('/job-applications', candidateJobApplicationTracking);

export default router;