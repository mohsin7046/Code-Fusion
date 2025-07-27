import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createCurrentSchedule = async (req, res) => {
    
    const {status,jobId}  = req.params;

   const currentIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    
    
    try {
       if (!jobId) {
            return res.status(400).json({ message: "Job ID and DateTime are required" });
        }

        const jobExists = await prisma.job.findUnique({
            where: { id: jobId }
        });

        if (!jobExists) {
            return res.status(404).json({ message: "Job not found" });
        }

        if(status === 'OnlineTest'){
            const schedule = await prisma.testAutomation.updateMany({
            where:{jobId:jobId},
            data: {
                onlineTestDate:currentIST,
            }
          });

          return res.status(201).json({ message: "Online schedule created successfully", schedule });

        }else if(status === 'BehavioralInterview'){
            const schedule = await prisma.testAutomation.updateMany({
                where: { jobId:jobId },
                data: {
                    behavioralInterviewDate:Date.now(),
                }
            });

            return res.status(201).json({ message: "Behavioral interview schedule created successfully", schedule });

        } else if(status === 'CodingTest'){
            const schedule = await prisma.testAutomation.updateMany({
                where: { jobId:jobId },
                data: {
                    codingTestDate: Date.now(),
                }
            });
            return res.status(201).json({ message: "Coding test schedule created successfully", schedule });
        }
        
    } catch (error) {
        console.error("Error creating current schedule:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}