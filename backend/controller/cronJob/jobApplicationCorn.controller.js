import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

cron.schedule('* * * * *', async () => {
  console.log('[CRON] Running scheduled tasks...');

  await onlineTest_Status();
  await behaviourTest_Status();
  
});

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
                    where: { jobId: test.jobId },
                    data: { status: 'ONLINE_TEST_COMPLETED',
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
                    where: { jobId: test.jobId },
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