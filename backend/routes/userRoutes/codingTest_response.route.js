import  {Router} from 'express';
import { CodingTestResponse,CodingTestvalidateUser,createRoom} from '../../controller/userControllers/codingTest_response.controller.js';


const router = Router();

router.post('/CodingTestResponse',CodingTestResponse)
router.post('/CodingTestvalidateUser',CodingTestvalidateUser)
router.post('/createRoom',createRoom)

export default router