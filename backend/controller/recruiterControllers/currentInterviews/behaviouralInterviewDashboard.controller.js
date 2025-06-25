import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export const getbehavioralInterviewDashboard = async (req, res) => {
    try {
        const {recruiterId,jobId} = req.body;

        if(!recruiterId || !jobId) {
            return res.status(400).json({message: "Recruiter not found"});
        }

        const dashboardData = await prisma.job.findUnique({
            where: {
                id: jobId,
                recruiterId: recruiterId,
                hasAIInterview:true
            },
            select: {
                companyName: true,
                interviewRole: true,
                date: true,
                time: true,
                description: true,
                behavioralInterviews: {
                    select: {
                        id: true,
                        duration: true,
                        passingScore: true
                    }
                },
                CandidateJobApplication:{
                    select: {
                        id: true,
                        aiInterviewResponse:{
                            select:{
                                id:true,
                                name:true,
                                candidateId:true,
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
                }
            }
        })

        if (!dashboardData) {
            return res.status(404).json({message: "Job not found or AI interview not enabled"});
        }

        return res.status(200).json({
            message: "Behavioral interview dashboard data retrieved successfully",
            data: dashboardData
        });
        
    } catch (error) {
        console.error("Error in getbehavioralInterviewDashboard:", error);
        res.status(500).json({message: "Internal server error"});
    }
}