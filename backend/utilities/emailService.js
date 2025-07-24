import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure:false,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
    },
})

export const sendMail = async({to,subject,html})=>{
    try {
        const mailOptions = {
            from:process.env.SMTP_USER,
            to,
            subject,
            html,
        }
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.response);
        
         return { success: true, message: "Email sent successfully" };
    } catch (error) {
         console.log("Error sending email:", error);
        return { success: false, message: "Failed to send email" };
    
    }
}