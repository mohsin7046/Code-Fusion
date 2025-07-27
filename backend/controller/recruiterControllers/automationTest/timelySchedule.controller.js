import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createSchedule = async (req, res) => {
    const { jobId, recruiterId } = req.body;

    try {
        if(!jobId || !recruiterId) {
          return res.status(400).json({ message: "Job ID and Recruiter ID are required" });
        }
        
        const jobExists = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!jobExists) {
            return res.status(404).json({ message: "Job not found" });
        }

        const schedule = await prisma.testAutomation.create({
            data: {
                jobId: jobId,
                recruiterId: recruiterId,
            }
        });
        if (!schedule) {
            return res.status(500).json({ message: "Failed to create schedule" });
        }

        return res.status(201).json({ message: "Schedule created successfully", schedule });
    
    } catch (error) {
        console.error("Error creating schedule:", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}

export const getSchedule = async (req, res) => {
    const {jobId} = req.body;
    
    try {
        if (!jobId) {
            return res.status(400).json({ message: "Job ID is required" });
        }

        const jobExists = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!jobExists) {
            return res.status(404).json({ message: "Job not found" });
        }


        const schedules = await prisma.testAutomation.findMany({
            where: { jobId: jobId },
            select: {
                onlineTestDate: true,
                behavioralInterviewDate: true,
                codingTestDate: true,
            }
        });

        if (schedules.length === 0 || !schedules) {
            return res.status(404).json({ message: "No schedules found for this job" });
        }

        return res.status(200).json({data:schedules,hasOnlineTest:jobExists.hasOnlineTest, hasAIInterview: jobExists.hasAIInterview, hasCodingTest: jobExists.hasCodingTest });
    } catch (error) {
        console.error("Error fetching schedules:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const createTestSchedule = async(req,res)=>{
    const {jobId,Datetime} = req.body;
    console.log(Datetime);
    
    let {status} = req.body;
    status = status.toLowerCase();

    try {
        if (!jobId || !Datetime) {
            return res.status(400).json({ message: "Job ID and DateTime are required" });
        }


        const jobExists = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!jobExists) {
            return res.status(404).json({ message: "Job not found" });
        }

        if(status === 'onlinetest'){
            const schedule = await prisma.testAutomation.updateMany({
            where:{jobId:jobId},
            data: {
                onlineTestDate:new Date(Datetime)
            }
          });

          return res.status(201).json({ message: "Online schedule created successfully", schedule });

        }else if(status === 'behaviouraltest'){
            const schedule = await prisma.testAutomation.updateMany({
                where: { jobId:jobId },
                data: {
                    behavioralInterviewDate:new Date(Datetime)
                }
            });

            return res.status(201).json({ message: "Behavioral interview schedule created successfully", schedule });

        } else if(status === 'codingtest'){
            const schedule = await prisma.testAutomation.updateMany({
                where: { jobId:jobId },
                data: {
                    codingTestDate:new Date(Datetime)
                }
            });
            return res.status(201).json({ message: "Coding test schedule created successfully", schedule });
        }
        
    } catch (error) {
        console.log("Error creating online schedule:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}