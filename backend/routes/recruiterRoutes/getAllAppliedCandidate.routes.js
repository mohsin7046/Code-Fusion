import {Router} from 'express'
import getAllAppliedCandidate from '../../controller/recruiterControllers/verifyCandidate/getAllAppliedCandidate.controller.js';
const router = Router();

router.post('/getAllAppliedCandidates', getAllAppliedCandidate)

export default router;