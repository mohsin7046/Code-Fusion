import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getCodingTestDashboard = async (req, res) => {
    try {
        const {recruiterId,jobId} = req.body;

        console.log("Coding Res",req.body);
        

        if(!recruiterId || !jobId) {
            return res.status(400).json({message: "Recruiter not found"});
        }

        const codingTestRes = await prisma.job.findFirst({
            where: {
                id: jobId,
                recruiterId: recruiterId,
                hasCodingTest:true
            },
            select: {
                companyName: true,
                interviewRole: true,
                date: true,
                time: true,
                description: true,
                codingTests: {
                    select: {
                        id: true,
                        duration: true,
                    }
                },
                CandidateJobApplication:{
                    select: {
                        id: true,
                        status: true,
                        candidateId:true,
                        name:true,
                      codingTestResponse :{
                            select:{
                                id:true,
                                code:true,
                                feedback:true,
                            }
                        }
                    }
                }
            }
        })
        
        if(!codingTestRes ) {
            return res.status(404).json({message: "Coding test not found"});
        }

        console.log(codingTestRes);
        
        return res.status(200).json({success: true, message: "Coding test data found", data: codingTestRes});
    } catch (error) {
        console.error("Error in getCodingTestDashboard:", error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}