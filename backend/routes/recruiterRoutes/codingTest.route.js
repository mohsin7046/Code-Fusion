import {Router} from 'express'
import { createCodingTest} from '../../controller/recruiterControllers/codingTest.controller.js'

const router = Router();

router.post('/createCodingTest',createCodingTest);

export default router;