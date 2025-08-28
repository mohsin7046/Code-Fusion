import {PrismaClient} from '@prisma/client'
import { updateToken } from '../../utilities/jwtUtility.js';
import { testSchedule } from '../../utilities/InterviewSchedule.js';

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
            evaluationCriteria : evaluationCriteria || ""
          },
       })
    
       if(!behaviourTest){
        return res.status(400).json({message:"Behaviour Test not Created!!!!"})
       }

        const jobapp = await prisma.jobApplication.findFirst({
            where:{
                jobId: jobId,
            }
        })

        if(!jobapp){
             const job = await prisma.jobApplication.create({
             data: {
                jobId: behaviourTest.jobId,
               status: 'AI_INTERVIEW_PENDING',
            },
           });
           if (!job) {
            return res.status(500).json({ message: "Failed to update job applications" });
           }
        }
        
       const data = {
        jobId: behaviourTest.jobId,
        recruiterId: behaviourTest.recruiterId,
        hasAIInterview: JobCreated.hasAIInterview,
        hasOnlineTest: JobCreated.hasOnlineTest,
        hasCodingTest : JobCreated.hasCodingTest,
        onlineTestId: onlineTestId,
        behaviourTestId: behaviourTest.id,
        visibility: JobCreated.visibility,
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
            
        return res.status(200).json({ success: true, message: "Behaviour Shortlisted Emails updated successfully", emails: updatedEmails.behavioralInterviewShortlistedEmails });
    } catch (error) {
        console.error("Error updating Behaviour Shortlisted Emails:", error);
        return res.status(500).json({ success: false, message: "Internal server error" }); 
    }
}


export { createBehaviourTest,updateBehaviouralTestResponse,updatedBehaviourShortlistedEmails };