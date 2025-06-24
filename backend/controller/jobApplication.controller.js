import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const candidateJobApplicationTracking = async (req,res) =>{
    try {
        const {jobId,emails} = req.body;

        if (!jobId || !emails || !Array.isArray(emails) || emails.length === 0) {
            return res.status(400).json({ message: "Invalid input data" });
        }

        const jobApp  = await prisma.candidateJobApplication.findFirst({
            where:{
                jobId: jobId,
            }
        })
        if(jobApp){
            return res.status(200).json({message : "Job application already exists"});
        }
        const jobApplications = await prisma.candidateJobApplication.createMany({
            data : emails.map(email => ({
                jobId: jobId,
                candidateId: email
            }))
        })
        if(!jobApplications || jobApplications.count === 0) {
            return res.status(400).json({message: "Failed to create job applications"});
        }
        return res.status(201).json({message: "Job applications created successfully", count: jobApplications.count});
    } catch (error) {
        console.error("Error in jobApplicationTracking:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

