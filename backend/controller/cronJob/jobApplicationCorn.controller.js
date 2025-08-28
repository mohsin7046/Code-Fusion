import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { sendMail } from '../../utilities/emailService.js';
import { schedule } from '../../utilities/schedule.js';

const prisma = new PrismaClient();

cron.schedule('* * * * *', async () => {
  console.log('[CRON] Running scheduled tasks...');

  await onlineTest_Status();
  await behaviourTest_Status();
  await publicJobApplicationDeadline();
  await sendMailToProcessedApplication();
});


const publicJobApplicationDeadline = async () =>{
    try {
        let allPublicJobs = await prisma.job.findMany({
            where:{
                visibility : 'public',
                isDeadlineMailSent : false,
            },
            select : {
                user:{
                    select: {
                        email: true
                    }
                },
                id: true,
                date: true,
                deadline: true,
                interviewRole: true,
                description: true
            }
        })

        allPublicJobs = allPublicJobs.filter((job) => {
            const jobStart = new Date(job.date).getTime();
            // const deadlineMs = (job.deadline ?? 0) * 24 * 60 * 60 * 1000; 
            return jobStart + 180000 < Date.now();
        });

        if (allPublicJobs.length > 0) {
            for(const job of allPublicJobs) {
                await sendMail({
                    to: job.user.email,
                    subject: 'Your Public Job Application Deadline Reminder',
                    html: `
                    <div style="max-width: 600px; margin: auto; padding: 30px; background: #f9f9f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); color: #333;">

                    <div style="text-align: center; margin-bottom: 25px;">
                        <h2 style="color: #2b6cb0; margin: 0;">📢 Application Deadline Reminder</h2>
                    </div>

                    <p style="font-size: 16px; color: #444; margin-bottom: 20px;">
                        Dear Recruiter,
                    </p>

                    
                    <div style="background: #e6f0fa; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                        <h3 style="color: #2b6cb0; margin: 0 0 10px;">Job Title: ${job.interviewRole}</h3>
                        <p style="font-size: 15px; color: #333; margin: 0;">
                        ${job.description}
                        </p>
                    </div>

                    
                    <p style="font-size: 15px; color: #555; margin-bottom: 30px; line-height: 1.6;">
                        This is a gentle reminder that the application deadline for the public job 
                        <strong style="color: #2b6cb0;">${job.interviewRole}</strong> is approaching.
                    </p>

                    <div style="text-align: center; margin-bottom: 30px;">
                        <a href="http://localhost:5173/dashboard/candidate-details/${job.id}"
                        style="display: inline-block; background-color: #38a169; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; border: 2px solid #38a169; transition: background 0.3s;">
                        Go to Dashboard
                        </a>
                    </div>

                    <p style="font-size: 15px; color: #444; margin-bottom: 10px;">
                        Best regards,<br>
                        <strong>CodeFusion Teams</strong>
                    </p>

                    <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #888;">
                        Need help? Contact us at 
                        <a href="mailto:support@codefusion.com" style="color: #2b6cb0; text-decoration: none;">support@codefusion.com</a>
                    </div>

                    </div>
                `
                });

                const updateisDeadlineMailSent = await prisma.job.updateMany({
                    where: {
                        id: job.id,
                    },
                    data: {
                        isDeadlineMailSent: true,
                    },
                });

                if(!updateisDeadlineMailSent) {
                    console.log(`Failed to update isDeadlineMailSent for job ID: ${job.id}`);
                    continue;
                }
                console.log(`Email sent for job ID: ${job.id}`);
            }
        }

    } catch (error) {
        console.log("Error in publicJobApplicationDeadline:", error);
        return;
    }
}

const sendMailToProcessedApplication = async () =>{
    try {
        const getAllUnprocessedApp = await prisma.job.findMany({
            where :{
                visibility : "public",
                isPublicApplicationProcessed : false,
            },
            select: {
                id: true,
                user:{
                    select:{
                        email : true
                    }
                },
                hasAIInterview : true,
                hasCodingTest : true,
                hasOnlineTest : true,
                studentEmails : {
                    select:{
                        emails: true
                    }
                }
            }
        })
        if(getAllUnprocessedApp.length === 0) {
            console.log("No unprocessed public job applications found.");
            return;
        }

        for(const job of getAllUnprocessedApp){
            const testDetails = {
                "email": job.user.email,
                "jobId": job.id,
            }

            if(job.hasOnlineTest){
               testDetails.testname = 'OnlineTest';
            } else if(job.hasAIInterview){
               testDetails.testname = 'BehavioralInterview';
            } else if(job.hasCodingTest){
               testDetails.testname = 'CodingTest';
            }

            console.log(job.studentEmails);
                        
           const emailLength = job.studentEmails[0].emails.length;

            const mailSchedule = await schedule(testDetails, emailLength);

            if(!mailSchedule) {
                console.log(`Failed to schedule email for job ID: ${job.id}`);
                continue;
            }

            const updateisPublicApplicationProcessed = await prisma.job.update({
                where:{
                    id : job.id
                },
                data:{
                    isPublicApplicationProcessed : true
                }
            })

            if(!updateisPublicApplicationProcessed){
                console.log(`Failed to update isPublicApplicationProcessed for job ID: ${job.id}`);
            }

        }

        console.log("All unprocessed public job applications have been handled.");

    } catch (error) {
        console.log("Error in sendMailToProcessedApplication:", error)
        return;
    }
}

const onlineTest_Status = async () => {
    const now = new Date();
    try {
        const onlineTests = await prisma.onlineTest.findMany({
            where: {
                expiresAt: {
                    lte: now,
                },
            },
        });


        if (onlineTests.length > 0) {
            for (const test of onlineTests) {
                await prisma.jobApplication.updateMany({
                    where: { jobId: test.jobId,
                        status:{notIn:["AI_INTERVIEW_PENDING","AI_INTERVIEW_COMPLETED","CODING_TEST_PENDING","CODING_TEST_COMPLETED","UNDER_REVIEW","SELECTED","REJECTED","HIRED"]}
                     },
                    data: { 
                        status: 'ONLINE_TEST_COMPLETED',
                        onlineTestCompleted:true,
                    },
                });
            }
            console.log(`[CRON] Updated ${onlineTests.length} online tests to EXPIRED status.`);
        } else {
            console.log('[CRON] No online tests found that are expired.');
        }

    } catch (error) {
        console.error("Error in onlineTest_Status:", error);
        return;
    }
}

const behaviourTest_Status = async () => {
    const now = new Date();

    try {
        const behaviourTests = await prisma.behavioralInterview.findMany({
            where: {
                expiresAt: {
                    lte: now,
                },
            },
        });

        if (behaviourTests.length > 0) {
            for (const test of behaviourTests) {
                await prisma.jobApplication.updateMany({
                    where: { jobId: test.jobId,
                        status:{notIn:["CODING_TEST_PENDING","CODING_TEST_COMPLETED","UNDER_REVIEW","SELECTED","REJECTED","HIRED"]}
                     },
                    data: { status: 'AI_INTERVIEW_COMPLETED',
                        aiInterviewCompleted: true,
                     },
                });
            }
            console.log(`[CRON] Updated ${behaviourTests.length} behaviour tests to EXPIRED status.`);
        } else {
            console.log('[CRON] No behaviour tests found that are expired.');
        }

    } catch (error) {
        console.error("Error in behaviourTest_Status:", error);
        return;
    }
}