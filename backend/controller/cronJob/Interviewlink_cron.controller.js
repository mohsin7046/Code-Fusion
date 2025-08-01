import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { testSchedule } from '../../utilities/InterviewSchedule.js';

const prisma = new PrismaClient();

const onlineTestLinkCron = async()=>{
    const now = new Date();
    const tenMinutesBefore = new Date(now.getTime() + 10 * 60 * 1000);
    try {
        const res = await prisma.testAutomation.findMany({
            where:{
                onlineTestDate :{
                    gte: now,
                   lte: tenMinutesBefore
                },
                onlineEmailSent: false 
            }
        })

        if(res.length >0){
            for(const test of res){
                const {jobId} = test;
                const emails = await prisma.studentEmails.findFirst({
                    where: { jobId },
                    select: { emails: true,
                        onlinepassword : true
                     }
                })

                console.log(emails.emails);
                
                if(!emails || !emails.length===0 || !emails.emails){
                    console.error(`No emails found for job ID ${jobId}`);
                    continue;
                }
                const allRecipients = String(emails.emails.map(item => item.email).join(','));
                console.log(`Sending online test link to: ${allRecipients}`);
                
                const interviewLink = `http://localhost:5173/testdes/onlineTest/${jobId}`;

                const res = await testSchedule(interviewLink, allRecipients, emails.onlinepassword, "Online Test");
                if(res){
                    console.log("Email sent successfully to !!!",allRecipients);
                    const updateFlag = await prisma.testAutomation.update({
                    where: { id: test.id },
                    data: { onlineEmailSent: true }
                })
                }else{
                    console.log("Email not sent");
                }

                const updateJobStatus = await prisma.jobApplication.updateMany({
                    where : {jobId},
                    data:{
                        status : "ONLINE_TEST_PENDING",
                        currentPhase : "ONLINE_TEST"
                    }
                })
                if(updateJobStatus){
                    console.log(`Job applications for job ID ${jobId} updated to ONLINE_TEST_PENDING`);
                } else {
                    console.log(`No job applications found for job ID ${jobId}`);
                }

                const updateCandidateStatus = await prisma.candidateJobApplication.updateMany({
                    where: { jobId },
                    data: {
                        status: "ONLINE_TEST_PENDING",
                        currentPhase: "ONLINE_TEST"
                    }
                })
                if(updateCandidateStatus){
                    console.log(`Candidate job applications for job ID ${jobId} updated to ONLINE_TEST_PENDING`);
                } else {
                    console.log(`No candidate job applications found for job ID ${jobId}`);
                }

                const OA = await prisma.onlineTest.findFirst({
                    where: { jobId: jobId },
                    select: {
                        duration: true
                    }
                })
                    const jobStartDateTime = new Date(test.onlineTestDate);
                    const expiresAt = new Date(jobStartDateTime.getTime() + OA.duration * 60 * 1000);
                    const onlineTestDBUpdate  = await prisma.onlineTest.updateMany({
                        where:{jobId: jobId},
                        data:{
                            expiresAt : new Date(expiresAt)
                        }
                    })

                    if(onlineTestDBUpdate){
                        console.log(`Online test expiresAt updated for job ID ${jobId}`);
                    }else{
                        console.log(`No online test found for job ID ${jobId}`);
                    }  
            }
            console.log('Online test link emails sent successfully');
        }
        console.log('No online test links to send at this time');
    } catch (error) {
       console.error("Error in onlineTestLinkCron:", error);
         return;
    }
}

const behaviouralTestLinkCron = async()=>{
    const now = new Date();
    const tenMinutesBefore = new Date(now.getTime() + 10 * 60 * 1000);
    try {
        const res = await prisma.testAutomation.findMany({
            where:{
                behavioralInterviewDate :{
                    gte: now,
                    lte: tenMinutesBefore
                },
                behavioralEmailSent: false
            }
        })

        if(res.length >0){
            for(const test of res){
                const {jobId} = test;
               const hasOnlineTest = await prisma.job.findFirst({
                    where:{id : jobId},
                    select:{
                        hasOnlineTest: true,
                    }
                })
                let emails;
                let password;
                if(!hasOnlineTest || !hasOnlineTest.hasOnlineTest){
                 const studentEmails = await prisma.studentEmails.findFirst({
                    where: { jobId },
                    select: { 
                        emails: true,
                        behaviouralpassword : true
                    }
                })
                    emails = studentEmails.emails.map(item => item.email);
                    password = studentEmails.behaviouralpassword;
                }else{
                    const onlineTestShortlisted = await prisma.studentEmails.findFirst({
                    where: { jobId },
                    select:{
                        onlineTestShortlistedEmails : true,
                        behaviouralpassword : true
                    }
                    }) 
                    emails = onlineTestShortlisted.onlineTestShortlistedEmails.map(item => item.email)
                    password = onlineTestShortlisted.behaviouralpassword;
                }
                console.log(emails);
                if(!emails || !emails.length===0){
                    console.error(`No emails found for job ID ${jobId}`);
                    continue;
                }
                emails = String(emails.join(','));
                 const interviewLink = `http://localhost:5173/testdes/behaviouralTest/${jobId}`;

                const res = await testSchedule(interviewLink, emails, password, "Behavioral Test");
                if(res){
                    console.log("Email sent successfully to !!!",emails);
                    const updateFlag = await prisma.testAutomation.update({
                    where: { id: test.id },
                    data: { behavioralEmailSent: true }
                })
                }else{
                    console.log("Email not sent");  
                }

                const updateJobStatus = await prisma.jobApplication.updateMany({
                    where : {jobId},
                    data:{
                        status : "AI_INTERVIEW_PENDING",
                        currentPhase : "AI_INTERVIEW"
                    }
                })

                if(updateJobStatus){
                    console.log(`Job applications for job ID ${jobId} updated to AI_INTERVIEW_PENDING`);
                } else {
                    console.log(`No job applications found for job ID ${jobId}`);
                }

                const updateCandidateStatus = await prisma.candidateJobApplication.updateMany({
                    where: { jobId },
                    data: {
                        status: "AI_INTERVIEW_PENDING",
                        currentPhase: "AI_INTERVIEW"
                    }
                })

                if(updateCandidateStatus){
                    console.log(`Candidate job applications for job ID ${jobId} updated to AI_INTERVIEW_PENDING`);
                } else {
                    console.log(`No candidate job applications found for job ID ${jobId}`);
                }

                const BI = await prisma.behavioralInterview.findFirst({
                    where: { jobId: jobId },
                    select: {
                        duration: true
                    }
                })


                 const jobStartDateTime = new Date(test.behavioralInterviewDate);
                 const expiresAt = new Date(jobStartDateTime.getTime() + BI.duration * 60 * 1000);

                 const behaviourTestDBUpdate  = await prisma.behavioralInterview.updateMany({
                        where:{jobId: jobId},
                        data:{
                            expiresAt : new Date(expiresAt)
                        }
                    })

                    if(behaviourTestDBUpdate){
                        console.log(`Behaviour test expiresAt updated for job ID ${jobId}`);
                    }else{
                        console.log(`No behaviour test found for job ID ${jobId}`);
                    }

            }
            console.log('Behavioural test link emails sent successfully');
        }
        console.log('No behavioural test links to send at this time');
    } catch (error) {
       console.error("Error in behaviouralTest Link Cron:", error);
       return;
    }
}

const codingTestLinkCron = async()=>{
    const now = new Date();
    const tenMinutesBefore = new Date(now.getTime() + 10 * 60 * 1000);
    try {
        const res = await prisma.testAutomation.findMany({
            where:{
                codingTestDate :{
                    gte: now,
                    lte: tenMinutesBefore
                },
                codingEmailSent: false
            }
        }) 

        if(res.length >0){
            for(const test of res){
                const {jobId} = test;
                const hasOnlineTest = await prisma.job.findFirst({
                    where:{id : jobId},
                    select:{
                        hasOnlineTest: true,
                        hasAIInterview: true,
                    }
                }) 

                let emails;
                let password;
                if(!hasOnlineTest || (!hasOnlineTest.hasOnlineTest && !hasOnlineTest.hasAIInterview)){
                 const studentEmails = await prisma.studentEmails.findFirst({
                    where: { jobId },
                    select: { 
                        emails: true,
                        behaviouralpassword : true
                    }
                })
                     emails = studentEmails.emails.map(item => item.email);
                    password = studentEmails.behaviouralpassword;
                }else if((hasOnlineTest.hasAIInterview && !hasOnlineTest.hasOnlineTest)){
                    const behavioralTestShortlisted = await prisma.studentEmails.findFirst({
                        where: { jobId },
                        select:{
                            behavioralInterviewShortlistedEmails: true,
                            codingpassword: true
                        }
                    })
                    emails = behavioralTestShortlisted.behavioralInterviewShortlistedEmails.map(item => item.email)
                    password = behavioralTestShortlisted.codingpassword;
                }else{
                    const onlineTestShortlisted = await prisma.studentEmails.findFirst({
                    where: { jobId },
                    select:{
                        onlineTestShortlistedEmails : true,
                        codingpassword : true
                    }
                    })
                    emails = onlineTestShortlisted.onlineTestShortlistedEmails.map(item => item.email)
                    password = onlineTestShortlisted.codingpassword;
                }

                if(!emails || !emails.length===0){
                    console.error(`No emails found for job ID ${jobId}`);
                    continue;
                }

                emails = String(emails.join(','));
                const interviewLink = `http://localhost:5173/testdes/codingTest/${jobId}`;

                const res = await testSchedule(interviewLink, emails, password, "Coding Test");
                if(res){
                    console.log("Email sent successfully to !!!",emails);
                    const updateFlag = await prisma.testAutomation.update({
                    where: { id: test.id },
                    data: { codingEmailSent: true }
                })
                }else{
                    console.log("Email not sent");
                }
                const updateJobStatus = await prisma.jobApplication.updateMany({
                    where : {jobId},
                    data:{
                        status : "CODING_TEST_PENDING",
                        currentPhase : "CODING_TEST"
                    }
                })
                if(updateJobStatus){
                    console.log(`Job applications for job ID ${jobId} updated to CODING_TEST_PENDING`);
                } else {
                    console.log(`No job applications found for job ID ${jobId}`);
                }

                const updateCandidateStatus = await prisma.candidateJobApplication.updateMany({
                    where: { jobId },
                    data: {
                        status: "CODING_TEST_PENDING",
                        currentPhase: "CODING_TEST"
                    }
                })
                if(updateCandidateStatus){
                    console.log(`Candidate job applications for job ID ${jobId} updated to CODING_TEST_PENDING`);
                } else {
                    console.log(`No candidate job applications found for job ID ${jobId}`);
                }

                 const CT = await prisma.codingTest.findFirst({
                    where: { jobId: jobId },
                    select: {
                        duration: true
                    }
                })

                 const jobStartDateTime = new Date(test.behavioralInterviewDate);
                 const expiresAt = new Date(jobStartDateTime.getTime() + CT.duration * 60 * 1000);

                 const codingTestDBUpdate  = await prisma.codingTest.updateMany({
                        where:{jobId: jobId},
                        data:{
                            expiresAt : new Date(expiresAt)
                        }
                    })

                    if(codingTestDBUpdate){
                        console.log(`Coding test expiresAt updated for job ID ${jobId}`);
                    }else{
                        console.log(`No coding test found for job ID ${jobId}`);
                    }
            }

        }
        console.log('No coding test links to send at this time');
    } catch (error) {
       console.error("Error in codingTest Link Cron:", error);
       return;
    }
}

cron.schedule('* * * * *', async() => {
    await onlineTestLinkCron();
    await behaviouralTestLinkCron();
    await codingTestLinkCron();
});