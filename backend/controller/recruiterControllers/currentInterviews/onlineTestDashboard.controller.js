import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const currentInterviewData = async(req,res)=>{
    const {id,status} = req.body;

try {
    let applications;
    if(status === "YET_TO_START"){
        applications = await prisma.job.findMany({
            where: {
                recruiterId: id,
                applications: {
                    some: {
                        currentPhase: status,
                    }
                }
            },
             select: {
                id: true,
                interviewRole: true,
                description: true,
                date: true,
                time: true 
            }
        });

        const jobsWithCounts = await Promise.all(
            applications.map(async (job) => {
          const totalApplicants = await prisma.unverifiedEmails.count({
            where: { jobId: job.id },
          });

          return {
            ...job,
            totalApplicants, 
          };
        })
      );

        applications = jobsWithCounts;
    } else {
        applications = await prisma.job.findMany({
            where: {
                recruiterId: id,
                applications: {
                 some: {
                     status: {
                         in: [
                             'ONLINE_TEST_PENDING',
                             'ONLINE_TEST_COMPLETED',
                             'AI_INTERVIEW_COMPLETED',
                             'APPLIED',
                             'CODING_TEST_COMPLETED',
                             'AI_INTERVIEW_PENDING',
                             'CODING_TEST_PENDING',
                            'UNDER_REVIEW'
                            ]
                         }
                    }
                }
            },
            select: {
                id: true,
                interviewRole: true,
                description: true,
                date: true,
                time: true,
                applications: {
                select:{
                    status: true,
                }
                } 
            }
    });
    }

    if(!applications || applications.length === 0){
        return res.status(404).json({message : "No applications found"});
    }
           
    return res.status(200).json({success : true, message : "Applications found", data : applications});
} catch (error) {
    console.error("Error in currentInterviewData:", error);
    return res.status(500).json({error : "Internal Server Error"});
}
}

export const getOnlineTestDashboard = async (req, res) => {
    try {
        const {recruiterId,jobId} = req.body;

        if(!recruiterId || !jobId) {
            return res.status(400).json({message: "Recruiter not found"});
        }

        const onlineTestData = await prisma.job.findFirst({
            where: {
                id: jobId,
                recruiterId: recruiterId,
                hasOnlineTest:true
            },
            select: {
                companyName: true,
                interviewRole: true,
                date: true,
                time: true,
                description: true,
                onlineTests: {
                    select: {
                        id: true,
                        duration: true,
                        passingScore: true
                    }
                },
                CandidateJobApplication:{
                    select: {
                        id: true,
                        status: true,
                        candidateId:true,
                        name:true,
                      onlineTestResponse :{
                            select:{
                                id:true,
                                score: true,
                                name:true,
                                percentage : true,
                                candidateId : true,
                                totalCorrectAnswers : true,
                                totalQuestions : true,
                                cheatingDetected : true,
                                cheatingReason : true,
                                passed : true,
                                timeTaken : true,  
                                submittedAt:true
                            }
                        }
                    }
                }
            }
        })
        
        if(!onlineTestData ) {
            return res.status(404).json({message: "Online test not found"});
        }
        return res.status(200).json({success: true, message: "Online test data found", data: onlineTestData});
    } catch (error) {
        console.error("Error in getbehavioralInterviewDashboard:", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}