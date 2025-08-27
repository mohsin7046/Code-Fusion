import {Router} from 'express'
import multer from "multer";
import getAllShortlistedCandidate from '../../controller/recruiterControllers/shortlistCandidate/shortlistedCandidate.controller.js';
import { offerLetterUpload } from '../../controller/recruiterControllers/shortlistCandidate/shortlistedCandidate.controller.js';


const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.post('/shortlistedCandidates', getAllShortlistedCandidate);
router.post('/offerLetterUpload', upload.fields([
    { name: "offerLetter", maxCount: 1 }
  ]),offerLetterUpload);

export default router;