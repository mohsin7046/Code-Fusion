import  {Router} from 'express';
import { CodingTestResponse,CodingTestFeedbackResponse,CodingTestvalidateUser } from '../../controller/userControllers/codingTest_response.controller.js';


const router = Router();

router.post('/CodingTestResponse',CodingTestResponse)
router.post('/CodingTestFeedbackResponse',CodingTestFeedbackResponse)
router.post('/CodingTestvalidateUser',CodingTestvalidateUser)

export default router