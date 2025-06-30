import { PrismaClient } from "@prisma/client";
import { sendMail } from '../../utilities/emailService.js';

const prisma = new PrismaClient();

export const Addallemails = async (req, res) => {
    try {
        const { jobId, recruiterId, onlineTestId,behavioralInterviewId, emails,codingTestId} = req.body;
        
        if (!jobId || !recruiterId || !emails || !Array.isArray(emails) || !codingTestId) {
             return res.status(400).json({ message: "All fields are required and emails must be an array" });
        }

        const OApassword = await prisma.onlineTest.findUnique({
            where: {
                id: onlineTestId,
            },
            select: {
                password: true,
            },
        });

    
        const BIpassword = await prisma.behavioralInterview.findUnique({
            where: {
                id: behavioralInterviewId,
            },
            select: {
                password: true,
            },
        })

        const CTpassword = await prisma.codingTest.findUnique({
            where:{
               id:codingTestId 
            },
            select:{
               password:true 
            }
        })

        let arrayEmails = [];

        for (let email of emails) {
           arrayEmails.push({
              email: email,
              isValidated: false,
              isBehvaioralValidated: false,
              isCodingValidate:false
     });
    }

        const addemails = await prisma.studentEmails.create({
            data: {
                jobId: jobId,
                recruiterId: recruiterId,
                onlineTestId: onlineTestId || null,
                codingTestId:codingTestId || null,
                onlinepassword: OApassword.password,
                behaviouralpassword: BIpassword.password,
                codingpassword : CTpassword.password,
                behavioralInterviewId: behavioralInterviewId || null,
                emails: arrayEmails
            },
        });

        if (!addemails) {
            return res.status(400).json({ message: "Failed to add emails" });
        }

        const interviewLink = `http://localhost:5173/testdes/onlineTest/${addemails.jobId}`;

        for (const email of emails) {
      
      await sendMail({
                    to: email,
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
                            🚀 You're Invited to Take Your Assessment!
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
    } 

        return res.status(201).json({ message: "Emails added successfully", addemails});

    } catch (error) {
        console.error("Error adding emails:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const UpdateOnlineTestShortlist = async (req, res) => {
    try {
        const {emails,jobId}  = req.body;

        if(!emails || emails.length === 0 || !jobId){
            return res.status(400).json({message:"All feilds are required"})
        }

        const existed = await prisma.studentEmails.findFirst({
            where:{
                jobId:jobId
            }
        });

        if(!existed){
            return res.status(400).json({message:"Student Emails not Found"})
        }

        const createdShortlistEmails = await prisma.studentEmails.update({
            where:{
                id:existed.id
            },

            data:{
                onlineTestShortlistedEmails:emails
            }
        })

        if(!createdShortlistEmails){
            return res.status(400).json({message:"Errro updating shortlist emails for onlineTest"})
        }

        return res.status(200).status({message:"Successfully updated shortlisted",data:createdShortlistEmails});

    } catch (error) {
        console.log("Error",error);
        
        return res.status(500).json({message:"Internal Server Error"})
    }
}


export const UpdateBehaviourTestShortlist = async (req, res) => {
    try {
        const {emails,jobId}  = req.body;

        if(!emails || emails.length === 0 || !jobId){
            return res.status(400).json({message:"All feilds are required"})
        }

        const existed = await prisma.studentEmails.findFirst({
            where:{
                jobId:jobId
            }
        });

        if(!existed){
            return res.status(400).json({message:"Student Emails not Found"})
        }

        const createdShortlistEmails = await prisma.studentEmails.update({
            where:{
                id:existed.id
            },

            data:{
                behavioralInterviewShortlistedEmails:emails
            }
        })

        if(!createdShortlistEmails){
            return res.status(400).json({message:"Errro updating shortlist emails for onlineTest"})
        }

        return res.status(200).status({message:"Successfully updated shortlisted",data:createdShortlistEmails});

    } catch (error) {
        console.log("Error",error);
        
        return res.status(500).json({message:"Internal Server Error"})
    }
}


export const UpdateCodingTestShortlist = async (req, res) => {
    try {
        const {emails,jobId}  = req.body;

        if(!emails || emails.length === 0 || !jobId){
            return res.status(400).json({message:"All feilds are required"})
        }

        const existed = await prisma.studentEmails.findFirst({
            where:{
                jobId:jobId
            }
        });

        if(!existed){
            return res.status(400).json({message:"Student Emails not Found"})
        }

        const createdShortlistEmails = await prisma.studentEmails.update({
            where:{
                id:existed.id
            },

            data:{
                codingTestShortlistedEmails:emails
            }
        })

        if(!createdShortlistEmails){
            return res.status(400).json({message:"Errro updating shortlist emails for onlineTest"})
        }

        return res.status(200).status({message:"Successfully updated shortlisted",data:createdShortlistEmails});

    } catch (error) {
        console.log("Error",error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}