import { PrismaClient } from "@prisma/client";
import { updateToken } from "../../utilities/jwtUtility.js";

const prisma = new  PrismaClient();


export const createCodingTest = async (req,res)=>{
    try {
        const {jobId,recruiterId,title,description,duration,onlineTestId,behaviourTestId} = req.body;

        console.log(req.body);
        
         if(!jobId || !recruiterId || !title || !description || !duration) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const jobExists = await prisma.job.findUnique({
            where: { id: jobId}
        });
        if (!jobExists) {
            return res.status(404).json({ message: "Job not found" });
        }
        if(!jobExists.hasCodingTest){
            return res.status(400).json({ message: "This job does not have an Coding test" });
        }

       const codingTest =  await prisma.codingTest.create({
            data:{
                jobId,
                recruiterId,
                title,
                description,
                password : Math.random().toString(36).slice(-8),
                duration : parseInt(duration)
            }
        })
        if(!codingTest){
            return res.status(400).json({ message: "Error Creating Coding Test" });
        }

         const jobapp = await prisma.jobApplication.findFirst({
            where:{
                jobId: jobId,
            }
        })

        if(!jobapp){
             const job = await prisma.jobApplication.create({
             data: {
                jobId: codingTest.jobId,
               status: 'CODING_TEST_PENDING',
            },
           });
           if (!job) {
            return res.status(500).json({ message: "Failed to update job applications" });
           }
        }

        const data = {
            jobId: codingTest.jobId,
            recruiterId: codingTest.recruiterId,
            hasAIInterview: jobExists.hasAIInterview,
            hasOnlineTest: jobExists.hasOnlineTest,
            hasCodingTest : jobExists.hasCodingTest,
            onlineTestId: onlineTestId || null,
            behaviourTestId: behaviourTestId || null,
            codingTestId : codingTest.id,
            visibility: jobExists.visibility,
        }
        updateToken(res, data);
        return res.status(201).json({success: true, message : "Coding Test Created Successfully",data: codingTest});
    } catch (error) {
        console.log("Error Creating Coding Test",error.message);
        return res.status(500).json({success : false,message: "Internal Server Error"})
    }
}