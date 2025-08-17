import {Router} from 'express'
import getAllAppliedCandidate from '../../controller/recruiterControllers/verifyCandidate/getAllAppliedCandidate.controller.js';
import acceptRejectCandidate from '../../controller/recruiterControllers/verifyCandidate/acceptReject.controller.js';
const router = Router();

router.post('/getAllAppliedCandidates', getAllAppliedCandidate)
router.post('/acceptReject', acceptRejectCandidate);

export default router;