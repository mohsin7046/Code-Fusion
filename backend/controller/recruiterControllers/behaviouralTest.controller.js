import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

const createBehaviourTest = async(req,res) =>{
    try {
        const {jobId,recruiterId,totalQuestions,subjects,questions,duration,passingScore,OverallFeedback,keyWords,evaluationCriteria} = req.body;
          
        if (
          !jobId ||
          !recruiterId ||
          !totalQuestions ||
          !Array.isArray(subjects) || subjects.length === 0 ||
          !Array.isArray(questions) || questions.length === 0 ||
          !duration ||
          !passingScore ||
          !Array.isArray(keyWords) || keyWords.length === 0 ||
          !evaluationCriteria
        ) {
          return res.status(400).json({ message: "All fields are required!" });
        }

        // const JobCreated = await prisma.job.findUnique({
        //     where:{id:jobId}
        // });

        // if(!JobCreated){
        //     return res.status(400).json({message:"Job is not created!!!"})
        // }
        // if(!JobCreated.hasAIInterview){
        //     return res.status(400).json({message:"Behaviour Test isnot selected"})
        // }


        // const recruiterCreated = await prisma.job.findUnique({
        //     where:{id:recruiterId},
        // })

        // if(!recruiterCreated){
        //     return res.status(400).json({message:"Recuriter not found"})
        // }
    
        const behavouirTest = await prisma.behavioralInterview.create({
           data: {
            jobId,
            recruiterId,
            totalQuestions,
    
             subjects: {
              create: subjects.map((subject) => ({
                name: subject.name,
                questionCount: subject.questionCount,
                maxScore: subject.maxScore
              })),
            },
    
            questions: {
              create: questions.map((q) => ({
                question: q.question,
                subject: q.subject,
                difficulty: q.difficulty || "EASY",
                maxScore: q.maxScore
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
            OverallFeedback: OverallFeedback || "",
            evaluationCriteria,
          },
       })
    
       if(!behavouirTest){
        return res.status(400).json({message:"Behaviour Test not Created!!!!"})
       }
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}
export { createBehaviourTest };