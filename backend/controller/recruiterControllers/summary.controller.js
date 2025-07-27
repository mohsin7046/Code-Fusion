import { PrismaClient } from "@prisma/client";
import {schedule} from '../../utilities/schedule.js'


const prisma = new PrismaClient();

const createSummary = async (req, res) => {
    const {jobId,recruiterId,onlineTestId,behavioralInterviewId,codingTestId,totalStudent} = req.body;
    console.log(req.body);
    
    try {
        if(!jobId || !recruiterId) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const jobExists = await prisma.job.findUnique({
            where: {id : jobId}
        })
        if (!jobExists) {
            return res.status(404).json({ message: "Job not found" });
        }
        const recruiterExists = await prisma.user.findUnique({
            where: { id: recruiterId, role: 'RECRUITER' }
        });
        if (!recruiterExists) {
            return res.status(404).json({ message: "Recruiter not found" });
        }

        if(onlineTestId !== null || onlineTestId || onlineTestId !== undefined){
        const onlineTestExists = await prisma.onlineTest.findUnique({
            where: { id: onlineTestId }
        });
        if (!onlineTestExists) {
            return res.status(404).json({ message: "Online test not found" });
        }
    }

        if(behavioralInterviewId !== null || behavioralInterviewId || behavioralInterviewId !== undefined){
        const behavioralInterviewExists = await prisma.behavioralInterview.findUnique({
            where: { id: behavioralInterviewId }
        });
        if (!behavioralInterviewExists) {
            return res.status(404).json({ message: "Behavioral interview not found" });
        }
    }

        const summary = await prisma.summary.create({
            data: {
                jobId: jobId,
                recruiterId: recruiterId,
                onlineTestId: onlineTestId || null,
                behavioralInterviewId: behavioralInterviewId || null,
                codingTestId: codingTestId || null,
            }
        });
        if (!summary) {
            return res.status(500).json({ message: "Failed to create summary" });
        }

        const testDetails = {
            "email": recruiterExists.email,
            "jobId":jobId,
        }

        if(onlineTestId || onlineTestId !== null || onlineTestId !== undefined){
           testDetails.testname = 'OnlineTest';
        } else if(behavioralInterviewId !== null || behavioralInterviewId || behavioralInterviewId !== undefined){
            testDetails.testname = 'BehavioralInterview';
        }else if(codingTestId !== null || codingTestId || codingTestId !== undefined){
            testDetails.testname = 'CodingTest';
        }

        const mailSchedule = schedule(testDetails, totalStudent);
        
        if(!mailSchedule) {
            return res.status(500).json({ message: "Failed to send schedule email" });
        }

        return res.status(201).json({ message: "Summary created successfully", summary });
    } catch (error) {
        console.error("Error creating summary:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}



 const getSummary = async (req, res) => {
    const { jobId } = req.body;
    try {
        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }
        const summary = await prisma.summary.findMany({
            where: { jobId },
            include: {
                job: {
                    select: {
                        companyName: true,
                        interviewRole: true,
                        date: true,
                        time: true,
                        description: true,
                        hasOnlineTest: true,
                        hasAIInterview: true,
                        hasCodingTest: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                },
                onlineTest: {
                    select: {
                        title: true,
                        description: true,
                        duration: true,
                        totalQuestions: true,
                        passingScore: true,
                        subjects: true,
                        expiresAt: true
                    }
                },
                behavioralInterview: {
                    select: {
                        totalQuestions: true,
                        duration: true,
                        passingScore: true,
                        evaluationCriteria: true,
                        keyWords: true
                    }
                },
                codingTest:{
                    select:{
                        title:true,
                        description:true,
                        duration:true
                    }
                }
        }
        });

        console.log("Summary fetched successfully:", summary[0]);
        

        if (summary.length === 0) {
            return res.status(404).json({ message: "No summaries found for this job" });
        }
        
        return res.status(200).json(summary);
    } catch (error) {
        console.error("Error fetching summary:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { createSummary ,getSummary};