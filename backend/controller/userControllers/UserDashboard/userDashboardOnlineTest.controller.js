import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

export const getUserDashboardData = async(req,res) => {
    try {
        const {email} = req.body;
    
        if(!email){
            return res.status(400).json({message:"Email not found"});
        }

        const onlineTestresponse = await prisma.candidateJobApplication.findMany({
            where:{
                candidateId:email
            },
            select:{
                jobId:true
            }
        });

        console.log("onlineTestresponse",onlineTestresponse);
        

        if(!onlineTestresponse){
            return res.status(400).json({message:"candidate Application not found"});
        }
        let arr = [];
        for(const res of onlineTestresponse){
            const {jobId} = res;
            const test = await prisma.job.findUnique({
                where: { id: jobId },
                select:{
                     id: true,
                     description: true,
                     interviewRole: true,
                     time: true,
                     date: true,
                     CandidateJobApplication:{
                        select:{
                            status: true
                        }
                    }
                } 
            })
            if(!test) {
                continue;
            }
            arr.push(test);
        }
        console.log("arr",arr);
        
        return res.status(200).json({message:"found successfully", data : arr})
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
                        name:true,
                        candidateId:true,
                        onlineTestResponse: {
                            select: {
                                score: true,
                                percentage: true,
                                totalQuestions: true,
                                totalCorrectAnswers: true,
                                cheatingDetected: true,
                                cheatingReason: true,
                                passed: true,
                                timeTaken: true,
                            }
                        }
                    }
                },
                onlineTests:{
                    select:{
                        title:true,
                        description:true,
                        duration:true,
                        totalQuestions:true,
                        passingScore:true,
                        subjects:true,
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
