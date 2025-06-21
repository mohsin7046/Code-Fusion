import {jobApplicationTracking} from '../controller/jobApplication.controller.js';
import {Router} from 'express';

const router = Router();
router.post('/job-applications', jobApplicationTracking);

export default router;