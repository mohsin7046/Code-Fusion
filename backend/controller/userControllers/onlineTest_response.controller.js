import { PrismaClient } from "@prisma/client";
import { create } from "domain";

const prisma = new PrismaClient();

export const getALLQuestions = async (req, res) => {
    try {
        const {jobId} = req.body;
        
        const questions = await prisma.onlineTest.findFirst({
            where:{
                jobId: jobId
            },
            select:{
                questions:{
                    select:{
                        id:true,
                        question:true,
                        options:true,
                        points:true,
                    }
                },
                duration:true,
                id:true
            },
        });

    
        if (questions.length === 0 || !questions) {
            return res.status(404).json({
                success: false,
                message: "No questions found for the given job ID",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Questions retrieved successfully",
            data: questions,
        });


    } catch (error) {
        console.log("Error in getALLQuestions:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
        
    }
}


export const getDescription = async (req, res) => {
    try {
        const {jobId} = req.body;
        
        const description = await prisma.onlineTest.findFirst({
            where:{
                jobId: jobId
            }
            ,select:{
                description:true,
                title:true,
                duration:true,
                password:true,
                totalQuestions:true,
            }
        });

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

export const validateUser = async (req, res) => {
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
                onlinepassword: password,
            },
        })


        const matchingEmail = user?.emails?.find(e => e.email === email && e.isValidated === false);

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


export const isValidatedCheck = async (req, res) => {
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
            (e) => e.email === email && e.isValidated === false
        );

        if (!user || !matchedEmail) {
            return res.status(404).json({
                success: false,
                message: "User not found or email already validated",
            });
        }

        // Step 3: Update that specific email in array
        const updatedEmails = user.emails.map((e) =>
            e.email === email ? { ...e, isValidated: true } : e
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


export const OnlineTest_Response = async (req, res) => {
  try {
    const {
      onlineTestId,
      email,
      jobId,
      answers, 
      totalQuestions,
      cheatingDetected = false,
      reason = "",
      timeTaken,
      name
    } = req.body;

    // 1. Basic validation
    if (!onlineTestId || !email || !jobId || !answers || !Array.isArray(answers) || !name) {
  return res.status(400).json({
    success: false,
    message:
      "Missing required fields: onlineTestId, email, jobId, or answers array.",
  });
}

if (!cheatingDetected && (answers.length === 0)) {
  return res.status(400).json({
    success: false,
    message:
      "Missing required fields: totalQuestions, answers, or timeTaken.",
  });
}


    const onlineTest = await prisma.onlineTest.findFirst({
      where: { jobId },
      select: {
        id: true,
        passingScore: true,
        questions: {
          select: {
            id: true,
            correctAnswer: true,
            points: true,
          },
        },
      },
    });


    const application = await prisma.candidateJobApplication.findFirst({
      where: { jobId },
    });


    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Job application not found.",
      });
    }

    

    const applicationId = application.id;

    const updateCandidateJob = await prisma.candidateJobApplication.update({
      where:{
        id:applicationId
      },
      data:{
        name:name
      }
    })

    if(!updateCandidateJob){
      return res.status(400).json({message:"Not have CandidateJob"})
    }

    if (!onlineTest || !onlineTest.questions || onlineTest.questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Online test not found or has no questions.",
      });
    }

    
    const totalMarks = onlineTest.questions.reduce((acc, q) => acc + q.points, 0);
    let score = 0;
    let totalCorrectAnswers = 0;

    const processedAnswers = answers.map((ans) => {
      const question = onlineTest.questions.find((q) => q.id === ans.questionId);
      if (!question) {
        return {
          questionId: ans.questionId,
          selectedOption: ans.selectedOption || null,
          isCorrect: false,
          points: 0,
        };
      }

      const isCorrect = question.correctAnswer === ans.selectedOption;
      const points = isCorrect ? question.points : 0;

      if (isCorrect) {
        score += points;
        totalCorrectAnswers += 1;
      }

      return {
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        isCorrect,
        points,
      };
    });

    const percentage = parseFloat(((score / totalMarks) * 100).toFixed(2));
    const passed = percentage >= onlineTest.passingScore;

    // 4. Save response

    const response = await prisma.candidateJobApplication.update({
      where:{
        id: applicationId,
      },
      data:{
        status:'ONLINE_TEST_COMPLETED',
        currentPhase:'ONLINE_TEST',
        onlineTestCompleted:true,
        onlineTestResponse:{
        create:{
        onlineTestId,
        candidateId: email,
        name:name,
        answers: {
          create: processedAnswers.map((a) => ({
            questionId: a.questionId,
            selectedOption: a.selectedOption,
            isCorrect: a.isCorrect,
            points: a.points,
          })),
        },
        totalQuestions,
        cheatingDetected,
        cheatingReason : reason,
        timeTaken,
        score,
        totalCorrectAnswers,
        percentage,
        passed,
      }
        }
      }
    })

    
    return res.status(201).json({
      success: true,
      message: "Test response submitted successfully.",
      data: {
        response,
        score,
        totalCorrectAnswers,
        percentage,
        passed,
      },
    });
  } catch (error) {
    console.error("Error saving test response:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while saving test response.",
    });
  }
};
