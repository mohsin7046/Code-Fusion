import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient();


const getAllAppliedCandidate = async (req, res) => {
    try {
        const { jobId } = req.body;
        const allCandidates = await prisma.unverifiedEmails.findMany({
            where:{
                jobId: jobId
            },

        })

        if (!allCandidates || allCandidates.length === 0) {
            return res.status(404).json({ message: "No candidates found" });
        }

        const formattedCandidates = await Promise.all(allCandidates.map((candidate) => {
            return prisma.userDocument.findUnique({
                where: {
                    email: candidate.email
                },
                select: {
                    email: true,
                    collegeName: true,
                    passingYear: true,
                    branch: true,
                    resumeUrl: true,
                    sscUrl: true,
                    sscPercentage: true,
                    hscPercentage : true,
                    hscUrl : true,
                    lastSemesterCGPA : true,
                    lastSemesterMarksheet : true
                }
            })
        }))

        const acceptedEmails = await prisma.studentEmails.findFirst({
            where:{
                jobId: jobId
            },
            select:{
                emails: true
            }
        })

        const formattedResponse = formattedCandidates.map((candidate) => {
            const isAccepted = acceptedEmails?.emails?.some(email => email.email === candidate.email);
            return {
                ...candidate,
                isAccepted: isAccepted || false,
            };
        });

        if (!formattedResponse || formattedResponse.length === 0) {
            return res.status(404).json({ message: "No candidates found" });
        }

        return res.status(200).json({ success: true, message: "Candidates found", data: formattedResponse });
    } catch (error) {
        console.log("Error in getAllAppliedCandidate:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export default getAllAppliedCandidate;