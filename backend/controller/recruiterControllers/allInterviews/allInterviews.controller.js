import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const allInterviews = async (req, res) => {
    const {id,status} = req.body;
    try {
      if (!id) {
        return res.status(400).json({ message: "Recruiter ID is required" });
      }

      let applications;
      if(status === 'shortlisted'){
         applications = await prisma.job.findMany({
         where: {
           recruiterId: id,
             applications: {
                some: {
                     status: {
                        in: [
                            "UNDER_REVIEW",
                        ]
                    }
                }
            }
        },
          select: {
          id: true,
          interviewRole: true,
          description: true,
          date: true,
          time: true,
        }
});
}else {

         applications = await prisma.job.findMany({
         where: {
           recruiterId: id,
             applications: {
                some: {
                     status: {
                        in: [
                            "UNDER_REVIEW",
                            "SELECTED",
                            "REJECTED",
                            "HIRED"
                        ]
                    }
                }
            }
        },
          select: {
            id: true,
            interviewRole: true,
            description: true,
            date: true,
            time: true,
            applications: {
              select:{
                status: true,   
              }
            } 
          }
});
}

    if(!applications || applications.length === 0){
        return res.status(404).json({message : "No applications found"});
    }
       
        return res.status(200).json({success : true, message : "Applications found", data : applications});
    
    } catch (error) {
        console.error("Error fetching all interviews:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}