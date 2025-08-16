import {Router} from "express"
import  getAllJobs  from "../../controller/userControllers/getAllJobs.controller.js";

const router = Router();

router.get("/jobs", getAllJobs);

export default router;
