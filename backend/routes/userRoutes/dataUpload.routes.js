import express from "express";
import multer from "multer";
import  uploadUserDocs  from "../../controller/userControllers/DocumentsData/documentsUpload.controller.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/upload",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "tenth", maxCount: 1 },
    { name: "twelfth", maxCount: 1 },
    { name: "lastSem", maxCount: 1 },
  ]),
  uploadUserDocs
);

export default router;
