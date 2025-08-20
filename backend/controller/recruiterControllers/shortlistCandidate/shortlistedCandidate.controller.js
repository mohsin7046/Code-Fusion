import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();


const getAllShortlistedCandidate =  async(req,res)=>{
    try {
        const {jobId} = req.body;
        
        const shortlistedCandidates = await prisma.candidateJobApplication.findFirst({
            where :{
                candidateId : jobId,
                status : "UNDER_REVIEW"
            },
            select:{
                id: true,
                candidateId: true,
                name: true,
                job:{
                    select:{
                        createdAt: true,
                    }
                }
            }
        });

        if (!shortlistedCandidates) {
            return res.status(404).json({
                message: "No shortlisted candidates found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Shortlisted candidates retrieved successfully",
            success: true,
            data: shortlistedCandidates
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        })
    }
}

export default getAllShortlistedCandidate;