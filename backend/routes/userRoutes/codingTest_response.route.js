import  {Router} from 'express';
import { CodingTestResponse,CodingTestFeedbackResponse,CodingTestvalidateUser,createRoom} from '../../controller/userControllers/codingTest_response.controller.js';


const router = Router();

router.post('/CodingTestResponse',CodingTestResponse)
router.post('/CodingTestFeedbackResponse',CodingTestFeedbackResponse)
router.post('/CodingTestvalidateUser',CodingTestvalidateUser)
router.post('/createRoom',createRoom)

export default router