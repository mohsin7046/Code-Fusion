import {PrismaClient} from '@prisma/client'
import { updateToken } from '../../utilities/jwtUtility.js';

const prisma = new PrismaClient();

const createBehaviourTest = async(req,res) =>{
    try {
        const {jobId,recruiterId,totalQuestions,questions,duration,passingScore,keyWords,evaluationCriteria,onlineTestId} = req.body;
          
        if (
          !jobId ||
          !recruiterId ||
          !totalQuestions ||
          !Array.isArray(questions) ||questions.length === 0 || !questions ||
          !duration ||
          !Array.isArray(keyWords) || keyWords.length === 0  || 
          !passingScore ||
          !evaluationCriteria ||
          !onlineTestId
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

export { createBehaviourTest };