import {Router} from 'express';

import applyForJob from '../../controller/userControllers/applyJobs.controller.js';

const router = Router();


router.post('/apply', applyForJob);

export default router;