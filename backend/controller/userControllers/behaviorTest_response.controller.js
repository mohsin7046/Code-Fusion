import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const getbehaviorTestQuestions = async (req, res) => {
    try {
        const {jobId} = req.body;

        if (!jobId) {
            return res.status(400).json({
                success: false,
                message: "Job ID is required"
            });
        }

        const question = await prisma.behavioralInterview.findFirst({
            where: {
                jobId: jobId
            },
            
            select: {
                questions: {
                    select: {
                        id: true,
                        question: true,
                        difficulty: true,
                    }
                },
                keyWords:{
                    select: {
                        id: true,
                        name: true,
                        subKeywords:true
                    }
                },
                duration: true,
                evaluationCriteria: true,
                passingScore: true,
            }, 
        })

        if(!question || question.questions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No questions found for the given job ID"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Behavioral test questions retrieved successfully",
            data: question
        } )
        
    } catch (error) {
        console.error("Error in getbehaviorTestQuestions:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}


export const getBehaviorTestResponse = async (req, res) => {
    try{
         const {jobId,behavioralInterviewId,email,transcript}  = req.body;
        
            if (!jobId || !behavioralInterviewId || !email || !transcript) {
                return res.status(400).json({
                    success: false,
                    message: "Job ID, Behavioral Interview ID, email, and answers are required"
                });
            }

            const application = await prisma.jobApplication.findFirst({
             where: { jobId },
           });

           if (!application) {
          return res.status(404).json({
         success: false,
         message: "Job application not found.",
         });
        }

        const applicationId = application.id;

        const testsubmittedResponse = await prisma.aIInterviewResponse.create({
            data:{
                behavioralInterviewId: behavioralInterviewId,
                candidateId: email,
                jobApplicationId: applicationId,
                transcript: transcript,
                status: "COMPLETED",
            }
        })

        if (!testsubmittedResponse) {
            return res.status(500).json({
                success: false,
                message: "Failed to submit the behavioral test response"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Behavioral test response submitted successfully",
            data: testsubmittedResponse
        });
    

    }catch(error){
        console.error("Error in getBehaviorTestResponse:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

export const updateBehaviorTestResponse = async (req, res) => {
    try {
        const {aiInterviewResponseId,overallScore,subjectiveScore,strengths,weaknesses,recommendations,feedback,passingScore} = req.body;

        if(!aiInterviewResponseId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const aiBehaviourExists = await prisma.aIInterviewResponse.findUnique({
            where:{id: aiInterviewResponseId}
        })
        if(!aiBehaviourExists) {
            return res.status(404).json({
                success: false,
                message: "Behavioral test response not found"
            });
        }
        const updatedResponse = await prisma.aIInterviewResponse.update({
            where: { id: aiInterviewResponseId },
            data: {
                overallScore: parseInt(overallScore),
                subjectiveScore: subjectiveScore,
                strengths: strengths,
                weaknesses: weaknesses,
                recommendations: recommendations,
                feedback: feedback,
                status  : "UNDER_REVIEW",
                passed : parseInt(overallScore) >= parseInt(passingScore) ? true : false,
            }
        })
        if (!updatedResponse) {
            return res.status(500).json({
                success: false,
                message: "Failed to update the behavioral test response"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Behavioral test response updated successfully",
            data: updatedResponse
        });
    } catch (error) {
        console.error("Error in updateBehaviorTestResponse:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}


export const getBehaviourDescription = async (req, res) => {
    try {
        const {jobId} = req.body;
        
        const description = await prisma.behavioralInterview.findFirst({
            where: {
                jobId: jobId
            },
            select: {
                description: true,
                id: true,
                title: true,
                duration: true,
                totalQuestions: true,
                password:true,
            }
        })

        if (description.length === 0 || !description) {
            return res.status(404).json({
                success: false,
                message: "No description found for the given job ID",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Descriptions retrieved successfully",
            data: description,
        });


    } catch (error) {
        console.log("Error in getting ALLDescription:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}


export const Behavioral_validateUser = async (req, res) => {
    try {
        const {email,password,JobId} = req.body;
        console.log("Request body in validateUser:", req.body);
        

        if (!email || !password || !JobId) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        
        const user = await prisma.studentEmails.findFirst({
            where: {
                jobId: JobId,
                behaviouralpassword: password,
            },
        })


        const matchingEmail = user?.emails?.find(e => e.email === email && e.isBehvaioralValidated === false);

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

        return res.status(200).json({
            success: true,
            message: "User validated successfully",
            
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


export const isBehaviourValidatedCheck = async (req, res) => {
    try {
        const { email, JobId } = req.body;

        if (!email || !JobId) {
            return res.status(400).json({
                success: false,
                message: "Email and Job ID are required",
            });
        }

        
        const user = await prisma.studentEmails.findFirst({
            where: {
                jobId: JobId,
            },
        });

       
        const matchedEmail = user?.emails?.find(
            (e) => e.email === email && e.isBehvaioralValidated === false
        );

        if (!user || !matchedEmail) {
            return res.status(404).json({
                success: false,
                message: "User not found or email already validated",
            });
        }

       
        const updatedEmails = user.emails.map((e) =>
            e.email === email ? { ...e, isBehvaioralValidated: true } : e
        );

        await prisma.studentEmails.update({
            where: { id: user.id },
            data: { emails: updatedEmails },
        });

        return res.status(200).json({
            success: true,
            message: "Email marked as validated",
        });

    } catch (error) {
        console.error("Error in isValidatedCheck:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};