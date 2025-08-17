import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const applyForJob = async (req, res) => {
    try {
        const { jobId, email } = req.body;

        if (!jobId || !email) {
            return res.status(400).json({
                success: false,
                message: "Job ID and email are required",
            });
        }

        const job = await prisma.job.findUnique({
            where: { id: jobId },
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        const existingApplication = await prisma.unverifiedEmails.findFirst({
            where: {
                jobId,
                email
            }
        });

        if (existingApplication) {
            return res.status(409).json({
                success: false,
                message: "Application already submitted",
            });
        }

        const application = await prisma.unverifiedEmails.create({
            data: {
                jobId,
                email,
            },
        });

        if (!application) {
            return res.status(400).json({
                success: false,
                message: "Failed to submit application",
            });
        }

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully",
        });
    } catch (error) {
        console.error("Error in applyForJob:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

export default applyForJob;