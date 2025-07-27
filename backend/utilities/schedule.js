import { sendMail } from '../utilities/emailService.js';

export async function schedule(testDetails, totalStudent) {
    const timelyScheduleLink = `http://localhost:5173/recruiter/testautomation/${testDetails.jobId}`;
            const currentScheduleLink = `http://localhost:3000/recruiter/${testDetails.testname}/${testDetails.jobId}`;
    
           const mailres = await sendMail({
      to: testDetails.email,
      subject: `✅ Job Created Successfully - Ready to Schedule ${testDetails.testname}!`,
      html: `
      <div style="max-width: 600px; margin: auto; padding: 30px; background: #f9f9f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); color: #333;">
    
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #e53e3e; margin-bottom: 10px;">🎉 Job Created Successfully</h2>
          <p style="font-size: 16px; margin: 0;">Total Candidates: <strong>${totalStudent}</strong></p>
        </div>
    
        <div style="display: flex; justify-content: center; gap: 20px; margin: 40px 0;">
          <a href="${timelyScheduleLink}" 
             style="background-color: #e53e3e; color: white; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; border: 2px solid #e53e3e; transition: 0.3s;">
             Timely Schedule
          </a>
    
          <a href="${currentScheduleLink}" 
             style="background-color: white; color: #e53e3e; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; border: 2px solid #e53e3e; transition: 0.3s;">
             Current Schedule
          </a>
        </div>
    
        <p style="font-size: 14px; text-align: center; color: #555;">
          You can now proceed to organize the interview slots for the shortlisted candidates. 
          Choose between scheduling interviews in advance or reviewing the current schedule.
        </p>
    
        <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #aaa;">
          Need help? Reach out to our team at <a href="mailto:support@codefusion.com" style="color: #e53e3e; text-decoration: none;">support@codefusion.com</a>
        </div>
    
      </div>
      `
    });

    if(mailres.success) {
       return true;
    }else{
        return false;
    }
}