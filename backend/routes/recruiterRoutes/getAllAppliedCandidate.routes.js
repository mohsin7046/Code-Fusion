import {Router} from 'express'
import getAllAppliedCandidate from '../../controller/recruiterControllers/verifyCandidate/getAllAppliedCandidate.controller.js';
import acceptRejectCandidate from '../../controller/recruiterControllers/verifyCandidate/acceptReject.controller.js';
import processApplication from '../../controller/recruiterControllers/verifyCandidate/processApplication.controller.js';

const router = Router();

router.post('/getAllAppliedCandidates', getAllAppliedCandidate)
router.post('/acceptReject', acceptRejectCandidate);
router.post('/processApplication', processApplication);

export default router;