import { PrismaClient } from "@prisma/client";
import { generateToken,updateToken } from "../../utilities/jwtUtility.js";
import {schedule} from "../../utilities/schedule.js";

const prisma = new PrismaClient();
const createJob = async(req,res) =>{
    const {recruiterId,companyName,interviewRole, date, time,description, hasOnlineTest,hasAIInterview,hasCodingTest} = req.body;
    try {
        if (!recruiterId || !companyName || !interviewRole || !date || !time || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const recruiterExists = await prisma.user.findUnique({
            where: { id: recruiterId, role: 'RECRUITER' }
        });
        if(!recruiterExists) {
            return res.status(404).json({ message: "Recruiter not found" });
        }


        const dateTimeString = `${date}T${time}:00`; // e.g., '2025-06-25T14:30:00'
        
        const job = await prisma.job.create({
            data:{
                recruiterId: recruiterId,
                companyName: companyName,
                interviewRole: interviewRole,
                date: new Date(dateTimeString),
                time: time,
                description: description,
                hasOnlineTest: hasOnlineTest || false,
                hasAIInterview: hasAIInterview || false,
                hasCodingTest: hasCodingTest || false
            }
        })
        if (!job) {
            return res.status(500).json({ message: "Failed to create Job" });
        }
        const data = {
            jobId: job.id,
            recruiterId: job.recruiterId,
            hasAIInterview: job.hasAIInterview,
            hasOnlineTest: job.hasOnlineTest,
            hasCodingTest: job.hasCodingTest,
        }
        const token =   generateToken(res, data);
        res.cookie('jobToken', token, {
            httpOnly: false,
            maxAge: 60 * 60 * 60*1000,
            sameSite: 'strict',
            secure:false,
        });
        return res.status(201).json({ message: "Job created successfully", job });
    } catch (error) {
        console.error("Error creating Job:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const createOnlineTest = async(req,res) =>{
    const {jobId,recruiterId,title,description,password,duration,totalQuestions,passingScore,subjects,questions} = req.body;
    try {
        if(!jobId || !recruiterId || !title || !description || !password || !duration || !totalQuestions || !passingScore || !subjects || !questions || !questions.length === 0 ) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const jobExists = await prisma.job.findUnique({
            where: { id: jobId}
        });
        if (!jobExists) {
            return res.status(404).json({ message: "Job not found" });
        }
        if(!jobExists.hasOnlineTest){
            return res.status(400).json({ message: "This job does not have an online test" });
      }
      
       const onlineTest =  await prisma.onlineTest.create({
            data :{
                jobId,
                recruiterId,
                title,
                description,
                password,
                duration,
                totalQuestions,
                passingScore,
                subjects : {
                create: 
                    subjects.map((subject) => ({
                        name: subject.name,
                        easyQuestions: subject.easyQuestions,
                        mediumQuestions: subject.mediumQuestions,
                        hardQuestions: subject.hardQuestions,
                        totalQuestions: subject.totalQuestions,
                    })),
                },
                questions : {
                create :
                    questions.map((question) => ({
                        question: question.question,
                        correctAnswer: question.correctAnswer,
                        options: question.options,
                        difficulty: question.difficulty,
                        subject: question.subject,
                        points: question.points || 1,
                    })),
                }
            }
        })
        if(!onlineTest){
            return res.status(500).json({ message: "Failed to create Online Test" });
        }

        const job = await prisma.jobApplication.create({
             data: {
                jobId: onlineTest.jobId,
               status: 'ONLINE_TEST_PENDING',
            },
           });

           if (!job) {
            return res.status(500).json({ message: "Failed to update job applications" });
           }

        const data = {
            jobId: onlineTest.jobId,
            recruiterId: onlineTest.recruiterId,
            hasAIInterview: jobExists.hasAIInterview,
            hasOnlineTest: jobExists.hasOnlineTest,
            hasCodingTest: jobExists.hasCodingTest,
            onlineTestId: onlineTest.id,
        }
        updateToken(res, data);
        return res.status(201).json({ message: "Online Test created successfully", test: onlineTest });
    } catch (error) {
        console.error("Error creating Online Test:", error);
       return res.status(500).json({ message: "Internal server error" });
    }
}

const getOnlineTest = async(req,res)=>{
    const {jobId, recruiterId} = req.body;
    try {
//TODO: Give response on the latest createdAt test field 
        const test = await prisma.onlineTest.findMany({
            where:{
                jobId: jobId,
                recruiterId: recruiterId
            },
            include:{
                questions: {
                    select:{
                        question: true,
                        correctAnswer: true,
                        options: true,
                        points: true
                    }
                }        
            }
        })
        if(!test) {
            return res.status(404).json({ message: "Online Test not found" });
        }
        return res.status(200).json({ message: "Online Test retrieved successfully", test });
    } catch (error) {
        console.error("Error retrieving Online Test:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const updateOnlineTestResponse = async(req,res)=>{
    const {id} = req.body;
   try {
     const existingResponse = await prisma.onlineTestResponse.findUnique({
            where: { id },
        });

        if (!existingResponse) {
            return res.status(404).json({ success: false, message: "Response not found" });
        }

        const updatedResponse = await prisma.onlineTestResponse.update({
            where: { id },
            data: {
                passed: !existingResponse.passed,
            },
        });
        if (!updatedResponse) {
            return res.status(500).json({ success: false, message: "Failed to update Online Test Response" });
        }
        return res.status(200).json({
            success: true,
            message: "Online Test Response updated successfully"
        });
   } catch (error) {
         console.error("Error updating Online Test Response:", error);
         return res.status(500).json({ success: false, message: "Internal server error" });
   }
}

const updateOnlineShortListedEmails = async(req,res)=>{
    const {jobId,emails} = req.body;
    console.log(req.body);
    
    try {
        if(!jobId || !emails || !Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({ success: false, message: "Job ID and emails are required" });
        }
        const existJobId = await prisma.studentEmails.findMany({
            where: { jobId: jobId }
        })
        if (!existJobId) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        let arrayEmails = [];
        for(let email of emails) {
            arrayEmails.push({
                email: email,
                isValidated: false,
            });
        }
        const updatedEmails = await prisma.studentEmails.update({
            where : { id: existJobId[0].id },
            data : {
               onlineTestShortlistedEmails : arrayEmails,
            }
        })
        if (!updatedEmails) {
            return res.status(500).json({ success: false, message: "Failed to update Online Shortlisted Emails" });
        }

        const recruiterExists = await prisma.user.findUnique({
            where: { id: existJobId[0].recruiterId }
        })


        const testDetails = {
            jobId: jobId,
            email:recruiterExists.email, 
            testname: "BehavioralInterview",
        }

        const schedules = await schedule(testDetails, emails.length);

        if (!schedules) {
            return res.status(500).json({ success: false, message: "Failed to send schedule email" });
        }
        
        return res.status(200).json({ success: true, message: "Online Shortlisted Emails updated successfully", emails: updatedEmails.onlineTestShortlistedEmails });
    } catch (error) {
        console.error("Error updating Online Shortlisted Emails:", error);
        return res.status(500).json({ success: false, message: "Internal server error" }); 
    }
}


export { createJob, createOnlineTest,getOnlineTest,updateOnlineTestResponse,updateOnlineShortListedEmails};
