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

export const shortlistCandidate_Coding = async(req,res)=>{
    const {id} = req.body;
   try {
    if(!id){
        return res.status(400).json({ success: false, message: "ID is required" });
    }
     const existingResponse = await prisma.codingTestResponse.findUnique({
            where: { id },
        });

        if (!existingResponse) {
            return res.status(404).json({ success: false, message: "Response not found" });
        }

        const updatedResponse = await prisma.codingTestResponse.update({
            where: { id },
            data: {
                passed: !existingResponse.passed,
            },
        });
        if (!updatedResponse) {
            return res.status(500).json({ success: false, message: "Failed to update Coding Test Response" });
        }
        return res.status(200).json({
            success: true,
            message: "Coding Test Response updated successfully"
        });
   } catch (error) {
         console.error("Error updating Coding Test Response:", error);
         return res.status(500).json({ success: false, message: "Internal server error" });
   }
}

export const allAllEmailstoFinalShortlisted = async(req,res)=>{
    try {
        const {jobId,emails} = req.body;
        if(!jobId || !emails || emails.length === 0){
            return res.status(400).json({ success: false, message: "Job ID and emails are required" });
        }
        const findJobInStudentEmails = await prisma.studentEmails.findFirst({
            where : {
                jobId
            }
        })
        if(!findJobInStudentEmails){
            return res.status(404).json({ success: false, message: "Job not found in student emails" });
        }

        const addemails = await prisma.studentEmails.updateMany({
            where:{
                jobId
            },
            data:{
               codingTestShortlistedEmails : {
                   set: emails
               }
            }
        })
        if(!addemails){
            return res.status(500).json({ success: false, message: "Failed to add emails to final shortlisted" });
        }
        return res.status(200).json({
            success: true,
            message: "Emails added to final shortlisted successfully"
        });
    } catch (error) {
        console.error("Error in allAllEmailstoFinalShortlisted:", error.message);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const codeFeedback = async(req,res)=>{
    try {
        const {candidateId,feedback} = req.body;
        if(!candidateId || !feedback){  
            return res.status(400).json({ success: false, message: "Candidate ID and feedback are required" });
        }

        const candidateResponse = await prisma.codingTestResponse.findFirst({
            where:{
               candidateId
            }
        })

        if(!candidateResponse){
            return res.status(404).json({
                success : false,
                message: "Candidate Response Not Found"
            });
        }

        const feedbackGiven = await prisma.codingTestResponse.updateMany({
            where : {
                candidateId
            },
            data:{
                feedback
            }
        })

        if(!feedbackGiven){
            return res.status(500).json({
                success : false,
                message: "Failed to give feedback"
            });
        }

        return res.status(200).json({
            success : true,
            message: "Feedback Given Successfully"
        });
    } catch (error) {
        console.error("Error in Coding Feedback:",error.message);
        return res.status(500).json({
            success : false,
            message: "Internal Server Error"
        });
    } 
}
