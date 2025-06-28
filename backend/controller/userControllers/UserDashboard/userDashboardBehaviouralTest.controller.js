export const getuserDashboardBehaviourTest = async (req,res) => {
    try {
        const {jobId} = req.body;
    
        if(!jobId){
            return res.status(400).json({message:"JobId not found"});
        }
    
        const BehaviourjobData = await prisma.job.findUnique({
            where:{id:jobId,hasOnlineTest:true},
            select:{
                candidateJobApplication:{
                    id:true,
                    status:true,
                    currentPhase:true,
                    aiInterviewCompleted:true,
                    hired:true,
                    aiInterviewResponse:{
                            name:true,
                            transcript:true,
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
        })
    
        if(!BehaviourjobData){
            return res.status(400).json({message:"Behaviour Test not found"});
        }
    
        return res.status(200).json({message:"Behaviour Test found successfully",data:BehaviourjobData})
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error!!!"})
    }
}