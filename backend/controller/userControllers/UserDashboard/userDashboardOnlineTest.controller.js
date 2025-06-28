import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export const getUserDashboardData = async(req,res) => {
    try {
        const {email} = req.body;
    
        if(!email){
            return res.status(400).json({message:"Email not found"});
        }
    
        const onlineTestresponse = await prisma.candidateJobApplication.findFirst({
            where:{
                candidateId:email
            },
            select:{
                jobId:true
            }
        });

        if(!onlineTestresponse){
            return res.status(400).json({message:"candidate Application not found"});
        }

        const jobData = await prisma.job.findMany({
            where:{
                id:onlineTestresponse.jobId
            },
            select:{
                id:true,
                companyName:true,
                interviewRole:true,
                date:true,
                time:true,
                description:true,
                applications:{
                    select:{
                        status:true,
                        currentPhase:true,
                        onlineTestCompleted:true,
                        aiInterviewCompleted:true,
                    }
                }
            }
        })

        if(!jobData){
             return res.status(400).json({message:"There is no JOB"});
        }

        return res.status(200).json({message:"found successfully", data:jobData})
        

    } catch (error) {
        return res.status(500).json({message:"Internal Server Error"})
    }

}


export const getuserDashboardOnlineTest = async (req, res) => {
    try {
        const { jobId } = req.body;

        if (!jobId) {
            return res.status(400).json({ message: "JobId not found" });
        }

        const OnlinejobData = await prisma.job.findFirst({
            where: {
                id: jobId,
                hasOnlineTest: true
            },
            select: {
                CandidateJobApplication: {
                    select: {
                        id: true,
                        status: true,
                        currentPhase: true,
                        onlineTestCompleted: true,
                        hired: true,
                        onlineTestResponse: {
                            select: {
                                name: true,
                                score: true,
                                percentage: true,
                                totalQuestions: true,
                                totalCorrectAnswers: true,
                                cheatingDetected: true,
                                cheatingReason: true,
                                passed: true,
                                timeTaken: true
                            }
                        }
                    }
                }
            }
        });

        if (!OnlinejobData) {
            return res.status(404).json({ message: "Online Test not found" });
        }

        return res.status(200).json({ message: "Online Test found successfully", data: OnlinejobData });

    } catch (error) {
        console.error("Error fetching dashboard test:", error); 
        return res.status(500).json({ message: "Internal Server Error!!!" });
    }
};
