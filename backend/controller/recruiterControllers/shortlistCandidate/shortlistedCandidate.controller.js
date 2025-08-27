import {PrismaClient} from '@prisma/client'
import cloudinary from "../../../utilities/cloudinaryConfig.js"
import streamifier from 'streamifier';

const prisma = new PrismaClient();


const getAllShortlistedCandidate =  async(req,res)=>{
    try {
        const {jobId} = req.body;
        
        const shortlistedCandidates = await prisma.candidateJobApplication.findFirst({
            where :{
                jobId : jobId,
                status : "UNDER_REVIEW"
            },
            select:{
                id: true,
                candidateId: true,
                name: true,
                job:{
                    select:{
                        createdAt: true,
                    }
                }
            }
        });

        if (!shortlistedCandidates) {
            return res.status(404).json({
                message: "No shortlisted candidates found",
                success: false
            });
        }

        console.log(shortlistedCandidates);
        

        return res.status(200).json({
            message: "Shortlisted candidates retrieved successfully",
            success: true,
            data: shortlistedCandidates
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        })
    }
}

export const offerLetterUpload = async(req,res)=>{
    try {

        const {jobId,candidateId } = req.body;

        console.log("offerLetter",req.files.offerLetter);
        

        if(!req.files.offerLetter || !jobId){
            return res.status(400).json({message:"All feilds are required!!"})
        }

         let offerLetterURL = await uploadToCloudinary(req.files.offerLetter[0].buffer, "offerLetter");

         if(!offerLetterURL){
            return res.status(400).json({message:"FIle is not uploaded!!"})
         }

         const updateDB = await prisma.candidateJobApplication.updateMany({
            where:{jobId,candidateId},
            data:{
                offerLetterUrl:offerLetterURL.secure_url,
                hired : true,
                currentPhase : "SELECTED"
            }
         })

         if(!updateDB){
            return res.status(400).json({message:"The file is not updaed to DB"});
         }

         return res.status(200).json({message:"Successfully",updateDB});
        
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"})
        console.error(error)
    }
}

const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};


export default getAllShortlistedCandidate;