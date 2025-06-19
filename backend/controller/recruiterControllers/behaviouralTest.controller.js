import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

const createBehaviourTest = async(req,res) =>{
    try {
        const {jobId,recruiterId,totalQuestions,questions,duration,passingScore,keyWords,evaluationCriteria} = req.body;
          
        if (
          !jobId ||
          !recruiterId ||
          !totalQuestions ||
          !Array.isArray(questions) || questions.length === 0 ||
          !duration ||
          !Array.isArray(keyWords) || keyWords.length === 0  || 
          !passingScore ||
          !evaluationCriteria
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
        return res.status(201).json({message:"Behaviour Test Created Successfully",behaviourTest});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
export { createBehaviourTest };