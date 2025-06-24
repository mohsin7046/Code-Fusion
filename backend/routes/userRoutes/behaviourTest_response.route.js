import  {Router} from 'express';
import { getbehaviorTestQuestions, getBehaviorTestResponse,updateBehaviorTestResponse,getBehaviourDescription,isBehaviourValidatedCheck,Behavioral_validateUser } from '../../controller/userControllers/behaviorTest_response.controller.js';


const router = Router();

router.post('/getbehaviorTestQuestions', getbehaviorTestQuestions);
router.post('/getBehaviorTestResponse', getBehaviorTestResponse);
router.patch('/updateBehaviorTestResponse', updateBehaviorTestResponse);
router.post('/getBehaviourDescription', getBehaviourDescription);
router.post('/Behavioral_validateUser', Behavioral_validateUser);
router.post('/isBehaviourValidatedCheck', isBehaviourValidatedCheck);

export default router;