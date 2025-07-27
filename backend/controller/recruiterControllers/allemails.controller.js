import { PrismaClient } from "@prisma/client";
import {schedule} from '../../utilities/schedule.js'

const prisma = new PrismaClient();

export const Addallemails = async (req, res) => {
    try {
        const { jobId, recruiterId, onlineTestId,behavioralInterviewId, emails,codingTestId} = req.body;

        console.log(req.body);
        
        
        if (!jobId || !recruiterId || !emails) {
             return res.status(400).json({ message: "All fields are required and emails must be an array" });
        }

        if(onlineTestId !== null || onlineTestId || onlineTestId !== undefined){
        var OApassword = await prisma.onlineTest.findUnique({
            where: {
                id: onlineTestId,
            },
            select: {
                password: true,
            },
        });
    }

    
        if(behavioralInterviewId !== null || behavioralInterviewId || behavioralInterviewId !== undefined){
        var BIpassword = await prisma.behavioralInterview.findUnique({
            where: {
                id: behavioralInterviewId,
            },
            select: {
                password: true,
            },
        })
    }

    if(codingTestId || codingTestId !== null || codingTestId !== undefined){
        var CTpassword = await prisma.codingTest.findUnique({
            where:{
               id:codingTestId 
            },
            select:{
               password:true 
            }
        })
    }

        let arrayEmails = [];

        for (let email of emails) {
           arrayEmails.push({
              email: email,
              isValidated: false,
              isBehvaioralValidated: false,
              isCodingValidate:false
     });
    }

    const recruiterExists = await prisma.user.findUnique({
            where: { id: recruiterId, role: 'RECRUITER' }
        });

        if (!recruiterExists) {
            return res.status(404).json({ message: "Recruiter not found" });
        }

        const addemails = await prisma.studentEmails.create({
            data: {
                jobId: jobId,
                recruiterId: recruiterId,
                onlineTestId: onlineTestId || null,
                behavioralInterviewId: behavioralInterviewId || null,
                codingTestId:codingTestId || null,
                onlinepassword: OApassword.password || null,
                behaviouralpassword: BIpassword.password || null,
                codingpassword : CTpassword.password || null,
                emails: arrayEmails
            },
        });

        if (!addemails) {
            return res.status(400).json({ message: "Failed to add emails" });
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
            
    
            const mailSchedule = schedule(testDetails, emails.length);
            
            if(!mailSchedule) {
                return res.status(500).json({ message: "Failed to send schedule email" });
            }

        return res.status(201).json({ message: "Emails added successfully", addemails});

    } catch (error) {
        console.error("Error adding emails:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


// export const UpdateOnlineTestShortlist = async (req, res) => {
//     try {
//         const {emails,jobId}  = req.body;
//         console.log("BODY: ",req.body);
        

//         if(!emails || emails.length === 0 || !jobId){
//             return res.status(400).json({message:"All feilds are required"})
//         }

//         const existed = await prisma.studentEmails.findMany({
//             where:{
//                 jobId:jobId
//             }
//         });

//         if(!existed){
//             return res.status(400).json({message:"Student Emails not Found"})
//         }

//         const createdShortlistEmails = await prisma.studentEmails.update({
//             where:{
//                 id:existed.id
//             },

//             data:{
//                 onlineTestShortlistedEmails:emails
//             }
//         })

//         if(!createdShortlistEmails){
//             return res.status(400).json({message:"Errro updating shortlist emails for onlineTest"})
//         }

//         return res.status(200).status({message:"Successfully updated shortlisted",data:createdShortlistEmails});

//     } catch (error) {
//         console.log("Error",error);
        
//         return res.status(500).json({message:"Internal Server Error"})
//     }
// }


// export const UpdateBehaviourTestShortlist = async (req, res) => {
//     try {
//         const {emails,jobId}  = req.body;

//         if(!emails || emails.length === 0 || !jobId){
//             return res.status(400).json({message:"All feilds are required"})
//         }

//         const existed = await prisma.studentEmails.findMany({
//             where:{
//                 jobId:jobId
//             }
//         });

//         if(!existed){
//             return res.status(400).json({message:"Student Emails not Found"})
//         }

//         const createdShortlistEmails = await prisma.studentEmails.update({
//             where:{
//                 id:existed.id
//             },

//             data:{
//                 behavioralInterviewShortlistedEmails:emails
//             }
//         })

//         if(!createdShortlistEmails){
//             return res.status(400).json({message:"Errro updating shortlist emails for onlineTest"})
//         }

//         return res.status(200).status({message:"Successfully updated shortlisted",data:createdShortlistEmails});

//     } catch (error) {
//         console.log("Error",error);
        
//         return res.status(500).json({message:"Internal Server Error"})
//     }
// }


// export const UpdateCodingTestShortlist = async (req, res) => {
//     try {
//         const {emails,jobId}  = req.body;

//         if(!emails || emails.length === 0 || !jobId){
//             return res.status(400).json({message:"All feilds are required"})
//         }

//         const existed = await prisma.studentEmails.findMany({
//             where:{
//                 jobId:jobId
//             }
//         });

//         if(!existed){
//             return res.status(400).json({message:"Student Emails not Found"})
//         }

//         const createdShortlistEmails = await prisma.studentEmails.update({
//             where:{
//                 id:existed.id
//             },

//             data:{
//                 codingTestShortlistedEmails:emails
//             }
//         })

//         if(!createdShortlistEmails){
//             return res.status(400).json({message:"Errro updating shortlist emails for onlineTest"})
//         }

//         return res.status(200).status({message:"Successfully updated shortlisted",data:createdShortlistEmails});

//     } catch (error) {
//         console.log("Error",error);
//         return res.status(500).json({message:"Internal Server Error"})
//     }
// }