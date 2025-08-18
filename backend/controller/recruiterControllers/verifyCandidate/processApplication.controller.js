import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


const processApplication = async(req,res)=>{
    try {
        const {jobId} = req.body;
        console.log(jobId);
        
        const findJob = await prisma.job.findUnique({
            where:{id : jobId}
        })

        if(!findJob){
            return res.status(400).json({
                message : "Job not found",
                success : false
            })
        }

        if(findJob.isPublicApplicationProcessed !== null && !findJob.isPublicApplicationProcessed){
            return res.status(400).json({
                message : "Public applications are already processed",
                success : false
            })
        }

        const updateApplicationProcessed = await prisma.job.updateMany({
            where:{
                id : jobId
            },
            data:{
                isPublicApplicationProcessed : false
            }
        })

        if(!updateApplicationProcessed){
            return res.status(400).json({
                message : "Error updating job",
                success : false
            })
        }

        return res.status(200).json({
            message : "Job application processed successfully",
            success : true
        })

    } catch (error) {
        console.log("Error Processing Application", error.message);
        return res.status(500).json({
            message : "Internal server error",
            success : false,
            error : error.message
        })
    }
}

export default processApplication;