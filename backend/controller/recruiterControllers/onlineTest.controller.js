import { PrismaClient } from "@prisma/client";

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

        const job = await prisma.job.create({
            data:{
                recruiterId: recruiterId,
                companyName: companyName,
                interviewRole: interviewRole,
                date: new Date(date),
                time: time,
                description: description,
                hasOnlineTest: hasOnlineTest || false,
                hasAIInterview: hasAIInterview || false,
                hasCodingTest: hasCodingTest || false
            }
        })
        return res.status(201).json({ message: "Job created successfully", job });
    } catch (error) {
        console.error("Error creating Job:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const createOnlineTest = async(req,res) =>{
    const {jobId,recruiterId,title,description,password,duration,totalQuestions,passingScore,subjects,questions,expiresAt} = req.body;
    try {
        if(!jobId || !recruiterId || !title || !description || !password || !duration || !totalQuestions || !passingScore || !subjects || !questions || !expiresAt) {
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
                subjects :{
                    create: subjects.map((subject) => ({
                        name: subject.name,
                        easyQuestions: subject.easyQuestions,
                        mediumQuestions: subject.mediumQuestions,
                        hardQuestions: subject.hardQuestions,
                        totalQuestions: subject.totalQuestions,
                    })),
                },
                questions :{
                    create: questions.map((question) => ({
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
        return res.status(201).json({ message: "Online Test created successfully", test: onlineTest });
    } catch (error) {
        console.error("Error creating Online Test:", error);
       return res.status(500).json({ message: "Internal server error" });
    }
}

export { createJob, createOnlineTest };