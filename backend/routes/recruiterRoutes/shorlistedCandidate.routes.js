import {Router} from 'express'
import getAllShortlistedCandidate from '../../controller/recruiterControllers/shortlistCandidate/shortlistedCandidate.controller.js';

const router = Router();

router.post('/shortlistedCandidates', getAllShortlistedCandidate);

export default router;