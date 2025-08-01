import { sendMail } from "./emailService.js";

export const testSchedule = async(link, allRecipients, password,testType) => {
    try {
       const res = await sendMail({
                            to: allRecipients,
                            subject: "⚡ Power Up Your Career - Assessment Time!",
                            html: `
                        <div style="max-width: 600px; margin: auto; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; border-radius: 15px; color: white; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                            
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #fff; margin: 0; font-size: 28px; font-weight: 700;">
                                    🎯 CodeFusion's Assessment Portal
                                </h1>
                                <div style="width: 80px; height: 4px; background: #ffd700; margin: 15px auto; border-radius: 2px;"></div>
                            </div>
        
                            <div style="background: rgba(255,255,255,0.95); padding: 30px; border-radius: 12px; color: #333; margin: 20px 0;">
                                <h2 style="color: #4a5568; text-align: center; margin-bottom: 20px;">
                                    🚀 You're Invited to Take Your ${testType} Assessment!
                                </h2>
                                
                                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">
                                    Hi there! 👋
                                </p>
                                
                                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                                    Congratulations on making it to the next step! We're excited to see what you can do. 
                                    Your personalized assessment is ready and waiting for you.
                                </p>
        
                                <div style="text-align: center; margin: 35px 0;">
                                    <a href="${link}" 
                                       style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); 
                                              color: white; 
                                              padding: 18px 40px; 
                                              text-decoration: none; 
                                              border-radius: 50px; 
                                              font-weight: bold; 
                                              font-size: 18px; 
                                              display: inline-block; 
                                              box-shadow: 0 5px 15px rgba(0,0,0,0.2); 
                                              transition: transform 0.3s ease;">
                                        🎯 Start My Assessment
                                    </a>
                                </div>
        
                                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #4ecdc4; margin: 25px 0;">
                                    <p style="margin: 0; font-size: 14px; color: #666;">
                                        <strong>💡 Quick Tip:</strong> Make sure you have a stable internet connection and find a quiet space before starting your assessment.
                                    </p>
                                </div>
        
                                <div style="text-align: center; margin-top: 30px;">
                                    <p style="font-size: 14px; color: #666; margin: 5px 0;">
                                        🔗 Direct Link: <a href="${link}" style="color: #4ecdc4; text-decoration: none;">${link}</a>
                                    </p>
        
                                    <p style="font-size: 14px; color: #666; margin: 5px 0;">
                                        🔗 Your Password: <b>${password}</b>
                                    </p>
                                </div>
                            </div>
        
                            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.3);">
                                <p style="font-size: 14px; color: rgba(255,255,255,0.8); margin: 10px 0;">
                                    Need help? We're here for you! 💪
                                </p>
                                <p style="font-size: 12px; color: rgba(255,255,255,0.6); margin: 5px 0;">
                                    If you have any questions, feel free to reach out to our support team.
                                </p>
                                
                                <div style="margin-top: 20px;">
                                    <a href="https://google.com" style="color: #ffd700; text-decoration: none; font-weight: bold; font-size: 16px;">
                                        ✨ The CodeFusion's Team
                                    </a>
                                </div>
                            </div>
                        </div>
                        `,
                        });

                        if (res.success) {
                             return true;
                        }else{
                            return false;
                        }
    } catch (error) {
        console.error("Error in testSchedule:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}