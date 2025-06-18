import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createSummary = async (req, res) => {
    const {jobId,recruiterId,onlineTestId,behavioralInterviewId,estimatedTime} = req.body;
    try {
        if(!jobId || !recruiterId || !onlineTestId || !behavioralInterviewId || !estimatedTime) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const jobExists = await prisma.job.findUnique({
            where: {id : jobId}
        })
        if (!jobExists) {
            return res.status(404).json({ message: "Job not found" });
        }
        const recruiterExists = await prisma.user.findUnique({
            where: { id: recruiterId, role: 'RECRUITER' }
        });
        if (!recruiterExists) {
            return res.status(404).json({ message: "Recruiter not found" });
        }
        const onlineTestExists = await prisma.onlineTest.findUnique({
            where: { id: onlineTestId }
        });
        if (!onlineTestExists) {
            return res.status(404).json({ message: "Online test not found" });
        }
        const behavioralInterviewExists = await prisma.behavioralInterview.findUnique({
            where: { id: behavioralInterviewId }
        });
        if (!behavioralInterviewExists) {
            return res.status(404).json({ message: "Behavioral interview not found" });
        }

        const summary = await prisma.summary.create({
            data: {
                jobId: jobId,
                recruiterId: recruiterId,
                onlineTestId: onlineTestId,
                behavioralInterviewId: behavioralInterviewId,
                estimatedTime: estimatedTime
            }
        });
        if (!summary) {
            return res.status(500).json({ message: "Failed to create summary" });
        }
        return res.status(201).json({ message: "Summary created successfully", summary });
    } catch (error) {
        console.error("Error creating summary:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export { createSummary };