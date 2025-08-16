import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        user: {
          select: {
            location: true,
          },
        },
      },
    });

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found" });
    }

    const formattedJobs = jobs.map((job) => {
      const tags = [];
      if (job.hasOnlineTest) tags.push("OnlineTest");
      if (job.hasAIInterview) tags.push("AIInterview");
      if (job.hasCodingTest) tags.push("CodingTest");

      return {
        id: job.id,
        interviewRole: job.interviewRole,
        companyName: job.companyName,
        companyDescription: job.description,
        location: job.user.location,
        tags,
      };
    });

    return res.status(200).json({ success: true, message: 'Successfully fetched all jobs', jobs: formattedJobs });
  } catch (error) {
    console.error("Error in getAllJobs:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export default getAllJobs;