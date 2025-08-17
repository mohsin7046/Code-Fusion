import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();
const acceptRejectCandidate = async (req, res) => {
   try{
        const { jobId, email, status } = req.body;
    let acceptedOrRejected;

    if (!jobId || !email || !status) {
      return res.status(400).json({ error: "jobId, email and status are required" });
    }

     let studentEmailRecord = await prisma.studentEmails.findUnique({
        where: { jobId: jobId },
        select: { emails: true },
      });

      let existingEmails = studentEmailRecord?.emails || [];
      if (!Array.isArray(existingEmails)) {
        existingEmails = [];
      }

    if (status === "accept") {
      const alreadyExists = existingEmails.some((e) => e.email === email);

      if (!alreadyExists) {
        existingEmails.push({
          email,
          isValidated: false,
          isBehvaioralValidated: false,
          isCodingValidate: false,
        });
      }

      acceptedOrRejected = await prisma.studentEmails.update({
        where: { jobId: jobId },
        data: { emails: existingEmails },
      });
    }

    if (status === "reject") {
        
      const updatedEmails = existingEmails.filter((e) => e.email !== email);

      acceptedOrRejected = await prisma.studentEmails.update({
        where: { jobId: jobId },
        data: { emails: updatedEmails },
      });
    }

    return res.status(200).json({
      message: `Email ${status}ed successfully`,
      data: acceptedOrRejected,
    });
       
    } catch (error) {
        console.error("Error in acceptRejectCandidate:", error);
        return res.status(500).json({ 
            success: false,
            error : error.message,
            message: "Internal Server Error" 
        });
    }
}

export default acceptRejectCandidate;
