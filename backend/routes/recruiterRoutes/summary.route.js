import {Router } from 'express';
import {createSummary,getSummary} from '../../controller/recruiterControllers/summary.controller.js';
import protectedRecruiter from '../../middleware/recruiter.middleware.js';
import { Addallemails } from '../../controller/recruiterControllers/allemails.controller.js';

const router = Router();

router.post('/create-summary', createSummary);
router.post('/get-summary', getSummary);
router.post('/add-emails',Addallemails);

// router.post('/UpdateOnlineTestShortlist',UpdateOnlineTestShortlist);
// router.post('/UpdateBehaviourTestShortlist',UpdateBehaviourTestShortlist);
// router.post('/UpdateCodingTestShortlist',UpdateCodingTestShortlist);


export default router;