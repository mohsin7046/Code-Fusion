import {PrismaClient} from '@prisma/client'
import { updateToken } from '../../utilities/jwtUtility.js';
import { sendMail } from "../../utilities/emailService.js";

const prisma = new PrismaClient();

const createBehaviourTest = async(req,res) =>{
    try {
        const {jobId,recruiterId,totalQuestions,questions,duration,passingScore,keyWords,evaluationCriteria,onlineTestId,title,description} = req.body;
          const password = Math.random().toString(36).slice(-8);
        
        if (
          !jobId ||
          !recruiterId ||
          !totalQuestions ||
          !Array.isArray(questions) ||questions.length === 0 || !questions ||
          !duration ||
          !Array.isArray(keyWords) || keyWords.length === 0  || 
          !passingScore ||
          !evaluationCriteria ||
          !onlineTestId||
          !password ||
          !title ||
          !description
        ) {
          return res.status(400).json({ message: "All fields are required!" });
        }

        const JobCreated = await prisma.job.findUnique({
            where:{id:jobId}
        });

        if(!JobCreated){
            return res.status(400).json({message:"Job is not created!!!"})
        }
        if(!JobCreated.hasAIInterview){
          return res.status(400).json({message:"Behaviour Test is not selected"})
        }

        const behaviourTest = await prisma.behavioralInterview.create({
           data: {
            jobId,
            recruiterId,
            title,
            description,
            password,
            totalQuestions,
            questions: {
              create: questions.map((q) => ({
                question: q.question,
                subject: q.subject,
                difficulty: q.difficulty || "EASY",
              })),
            },
            keyWords: {
              create: keyWords.map((kw) => ({
                name: kw.name,
                subKeywords: kw.subKeywords || []
              })),
            },
            duration,
            passingScore,
            OverallFeedback: "",
            evaluationCriteria : evaluationCriteria || "",
          },
       })
    
       if(!behaviourTest){
        return res.status(400).json({message:"Behaviour Test not Created!!!!"})
       }
       const data = {
        jobId: behaviourTest.jobId,
        recruiterId: behaviourTest.recruiterId,
        hasAIInterview: JobCreated.hasAIInterview,
        hasOnlineTest: JobCreated.hasOnlineTest,
        hasCodingTest : JobCreated.hasCodingTest,
        onlineTestId: onlineTestId,
        behaviourTestId: behaviourTest.id,
       }
        updateToken(res, data);
        return res.status(201).json({message:"Behaviour Test Created Successfully",behaviourTest});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}


export const getBehaviourTest = async(req,res) =>{
  try {
    const {jobId,recruiterId} = req.body;

    if (!jobId || !recruiterId) {
      return res.status(400).json({ message: "Job ID and Recruiter ID are required!" });
    }

    const getquestions = await prisma.behavioralInterview.findMany({
        where: {
          jobId: jobId,
          recruiterId: recruiterId
        },
        include: {
          questions: {
            select:{
              question: true,
              subject: true,
              difficulty: true
            }
          },
        },
        
    });


    if(!getquestions) {
      return res.status(404).json({ message: "Behavioural Test not found!" });
    }
    console.log(getquestions);
    return res.status(200).json({ message: "Behavioural Test retrieved successfully", getquestions });

  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"Internal Server Error"});
  }
}

const updateBehaviouralTestResponse = async(req,res)=>{
    const {id} = req.body;
   try {
     const existingResponse = await prisma.aIInterviewResponse.findUnique({
            where: { id },
        });

        if (!existingResponse) {
            return res.status(404).json({ success: false, message: "Response not found" });
        }

        const updatedResponse = await prisma.aIInterviewResponse.update({
            where: { id },
            data: {
                passed: !existingResponse.passed,
            },
        });
        if (!updatedResponse) {
            return res.status(500).json({ success: false, message: "Failed to update Behaviour Test Response" });
        }
        return res.status(200).json({
            success: true,
            message: "Behaviour Test Response updated successfully"
        });
   } catch (error) {
         console.error("Error updating Behaviour Test Response:", error);
         return res.status(500).json({ success: false, message: "Internal server error" });
   }
}


const updatedBehaviourShortlistedEmails = async(req,res)=>{
  const {jobId,emails} = req.body;
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
               behavioralInterviewShortlistedEmails : arrayEmails,
            }
        })
        if (!updatedEmails) {
            return res.status(500).json({ success: false, message: "Failed to update Behaviour Shortlisted Emails" });
        }
         const interviewLink = `http://localhost:5173/testdes/codingTest/${jobId}`;
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
                                🚀 You're Invited to Take Your Coding Test Assessment!
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

        return res.status(200).json({ success: true, message: "Behaviour Shortlisted Emails updated successfully", emails: updatedEmails.behavioralInterviewShortlistedEmails });
    } catch (error) {
        console.error("Error updating Behaviour Shortlisted Emails:", error);
        return res.status(500).json({ success: false, message: "Internal server error" }); 
    }
}


export { createBehaviourTest,updateBehaviouralTestResponse,updatedBehaviourShortlistedEmails };