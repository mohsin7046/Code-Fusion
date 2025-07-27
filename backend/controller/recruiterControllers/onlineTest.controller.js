import { PrismaClient } from "@prisma/client";
import { generateToken,updateToken } from "../../utilities/jwtUtility.js";
import { sendMail } from "../../utilities/emailService.js";

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
        if(!jobId || !recruiterId || !title || !description || !password || !duration || !totalQuestions || !passingScore || !subjects || !questions || !questions.length === 0 || !expiresAt) {
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
        // const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
        const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
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
                expiresAt: new Date(expiresAt),
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

        const interviewLink = `http://localhost:5173/testdes/behaviouralTest/${jobId}`;
        const emailSended = await sendMail({
            to: emails,
            subject: "⚡ Power Up Your Career - Assessment Time!",
            html: `
            <div style="max-width: 600px; margin: auto; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border-radius: 15px; color: white; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #fff; margin: 0; font-size: 28px; font-weight: 700;">
                        🎯 CodeFusion's Assessment Portal
                    </h1>
                    <div style="width: 80px; height: 4px; background: #ffd700; margin: 15px auto; border-radius: 2px;"></div>
                </div>

                <div style="background: rgba(255,255,255,0.95); padding: 30px; border-radius: 12px; color: #333; margin: 20px 0;">
                    <h2 style="color: #4a5568; text-align: center; margin-bottom: 20px;">
                        🚀 You're Invited to Take Your Behavioural Test Assessment!
                    </h2>
                    
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
                        Hi there! 👋
                    </p>
                    
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                        Congratulations on making it to the next step! We're excited to see what you can do. 
                        Your personalized assessment is ready and waiting for you.
                    </p>

                    <div style="text-align: center; margin: 35px 0;">
                        <a href="${interviewLink}" 
                            style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); 
                                    color: white; 
                                    padding: 18px 40px; 
                                    text-decoration: none; 
                                    border-radius: 50px; 
                                    font-weight: bold; 
                                    font-size: 18px; 
                                    display: inline-block; 
                                    box-shadow: 0 5px 15px rgba(0,0,0,0.2); 
                                    transition: transform 0.3s ease;">
                            🎯 Start My Assessment
                        </a>
                    </div>

                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #4ecdc4; margin: 25px 0;">
                        <p style="margin: 0; font-size: 14px; color: #666;">
                            <strong>💡 Quick Tip:</strong> Make sure you have a stable internet connection and find a quiet space before starting your assessment.
                        </p>
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <p style="font-size: 14px; color: #666; margin: 5px 0;">
                            🔗 Direct Link: <a href="${interviewLink}" style="color: #4ecdc4; text-decoration: none;">${interviewLink}</a>
                        </p>
                    </div>
                </div>

                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.3);">
                    <p style="font-size: 14px; color: rgba(255,255,255,0.8); margin: 10px 0;">
                        Need help? We're here for you! 💪
                    </p>
                    <p style="font-size: 12px; color: rgba(255,255,255,0.6); margin: 5px 0;">
                        If you have any questions, feel free to reach out to our support team.
                    </p>
                    
                    <div style="margin-top: 20px;">
                        <a href="https://google.com" style="color: #ffd700; text-decoration: none; font-weight: bold; font-size: 16px;">
                            ✨ The CodeFusion's Team
                        </a>
                    </div>
                </div>
            </div>
            `,
        });
        if (!emailSended) {
            return res.status(500).json({ success: false, message: "Failed to send emails" });
        }
        return res.status(200).json({ success: true, message: "Online Shortlisted Emails updated successfully", emails: updatedEmails.onlineTestShortlistedEmails });
    } catch (error) {
        console.error("Error updating Online Shortlisted Emails:", error);
        return res.status(500).json({ success: false, message: "Internal server error" }); 
    }
}


export { createJob, createOnlineTest,getOnlineTest,updateOnlineTestResponse,updateOnlineShortListedEmails};