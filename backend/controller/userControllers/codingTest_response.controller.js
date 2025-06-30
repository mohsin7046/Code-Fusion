import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const CodingTestResponse = async(req,res) => {
    try {
        const {codingTestId,candidateId,candidateJobApplicationId} = req.body;

        if(!codingTestId || !candidateId || !candidateJobApplicationId){
            return res.status(400).json({message:"All feilds are required!!"})
        }

        const existedResponse = await prisma.codingTestResponse.findFirst({
            where:{
                codingTestId,candidateId
            }
        })

        if(existedResponse){
            return res.status(400).json({message:"Already Response to CodingTest"})
        }

        const createCodingResponse = await prisma.codingTestResponse.create({
            data:{
                codingTestId:codingTestId,
                candidateId:candidateId,
                candidateJobApplication:candidateJobApplicationId,
            }
        })

        if(!createCodingResponse){
            return res.status(400).json({message:"Error while creating the CodeTest Response!!"})
        }

        return res.status(200).json({message:"Successfully created",data:createCodingResponse})

    } catch (error) {
        console.log("Error",error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}


export const CodingTestFeedbackResponse = async(req,res) => {
    const {feedback,timeTaken,codingTestResponseId} = req.body;

    if(!timeTaken || !codingTestResponseId){
        return res.status(400).json({message:"All feilds are required!!"})
    }

    const updatefeedback = await prisma.codingTestResponse.update({
        where:{
            id:codingTestResponseId
        },

        data:{
            feedback:feedback,
            timeTaken:timeTaken
        }
    })
}



export const CodingTestvalidateUser = async (req, res) => {
    try {
        
        const {email,password,jobId} = req.body;
        console.log("Request body in validateUser:", req.body);
        

        if (!email || !password || !jobId) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        
        const user = await prisma.studentEmails.findFirst({
            where: {
                jobId: jobId,
                codingpassword: password,
            },
        })

        const matchingEmail = user?.emails?.find(e => e.email === email && e.isCodingValidate === false);

        if (!matchingEmail) {
            return res.status(404).json({
                success: false,
                message: "User not found or email not validated",
            });
        }


        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const dataForTestResponse = await prisma.job.findFirst({
            where:{
                id:jobId
            },
            select:{
                codingTests:{
                    select:{
                        id:true,
                    }
                },
                CandidateJobApplication:{
                    select:{
                        id:true,
                    }
                }
            }
        })

        return res.status(200).json({
            success: true,
            message: "User validated successfully",
            data:dataForTestResponse
        });

    } catch (error) {
        console.log("Error in validateUser:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}