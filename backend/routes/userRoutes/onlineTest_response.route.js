import {Router} from 'express';
import { getDescription,getALLQuestions,validateUser,isValidatedCheck,OnlineTest_Response } from '../../controller/userControllers/onlineTest_response.controller.js';
import { getUserDashboardData, getuserDashboardOnlineTest } from '../../controller/userControllers/UserDashboard/userDashboardOnlineTest.controller.js';

const router = Router();

router.post('/getDescription', getDescription);
router.post('/getALLQuestions', getALLQuestions);
router.post('/validateUser', validateUser);
router.post('/getALLQuestions', getALLQuestions);
router.post('/isValidatedCheck', isValidatedCheck);
router.post('/response', OnlineTest_Response);


router.post('/getUserDashboardData', getUserDashboardData);
router.post('/getuserDashboardOnlineTest', getuserDashboardOnlineTest);





export default router;