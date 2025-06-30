import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export const getuserDashboardBehaviourTest = async (req,res) => {
    try {
        const {jobId} = req.body;

        console.log(jobId);
        
    
        if(!jobId){
            return res.status(400).json({message:"JobId not found"});
        }
    
        const BehaviourjobData = await prisma.job.findFirst({
            where:{id:jobId,hasAIInterview:true},
            select:{
                CandidateJobApplication:{
                    select:{
                    id:true,
                    status:true,
                    currentPhase:true,
                    aiInterviewCompleted:true,
                    hired:true,
                    aiInterviewResponse:{
                        select:{
                            name:true,
                            overallScore:true,
                            subjectiveScore:true,
                            strengths:true,
                            weaknesses:true,
                            recommendations:true,
                            status:true,
                            passed:true,
                            feedback:true,
                        }
                    }
                }
            },
            behavioralInterviews:{
                select:{
                    title:true,
                    description:true,
                    totalQuestions:true,
                    duration:true,
                    passingScore:true,
                    evaluationCriteria:true,
                }
            }
            }
        })
    
        if(!BehaviourjobData){
            return res.status(400).json({message:"Behaviour Test not found"});
        }
    
        return res.status(200).json({message:"Behaviour Test found successfully",data:BehaviourjobData})
    } catch (error) {
        console.error("Error in getuserDashboardBehaviourTest:", error);
        return res.status(500).json({message: "Internal Server Error"});

    }
}