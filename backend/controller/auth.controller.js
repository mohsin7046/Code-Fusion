import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utilities/bcrpyt.js';
import { generateToken } from '../utilities/jwtUtility.js';
import { sendMail } from '../utilities/emailService.js';

const prisma = new PrismaClient();

export const signup = async (req, res) => {
    try {
        const { username, email, password, confirmpassword,role,skills,socialLinks,location,company_name,company_description,company_role,company_website,company_location} = req.body;
        let user;
        if(role === "CANDIDATE"){
            
            if(!email || !password || !username || !confirmpassword || skills.length === 0 || socialLinks.length === 0 || !location){
               return res.status(400).json({ message: "All fields are required!!!" });  
            }

            if (password !== confirmpassword) {
               return res.status(400).json({ message: "Passwords do not match!!!" });
            }
            user = await prisma.user.findUnique({ where: { email } });
        }else if(role === "RECRUITER"){
            if(!email || !password || !username || !confirmpassword || !company_name || !company_description || !company_role || !company_website || !company_location){
                return res.status(400).json({ message: "All fields are required!!!" });
            }
            if (password !== confirmpassword) {
                return res.status(400).json({ message: "Passwords do not match!!!" });
            }
            user = await prisma.user.findUnique({ where: { email } });
        }else{
            return res.status(401).json({message:"UnAuthorized Role Access!!!"})
        }

        if(user){
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await hashPassword(password);
        const confirmHashedPassword = await hashPassword(confirmpassword);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                confirmpassword: confirmHashedPassword,
                role: role,
                skills: skills || [],
                socialLinks: socialLinks || [],
                location: location || "",
                company_name: company_name || "",
                company_description: company_description || "",
                company_role: company_role || "",
                company_website: company_website || "",
                company_location: company_location || ""
            }
        })
        newUser.password = undefined;
        newUser.confirmpassword = undefined;
        const data = {
            id: newUser.id,
            role: newUser.role,
            isVerified: newUser.isVerified,
            email: newUser.email,
        }
        if(newUser){
            return res.status(201).json({ message: "User created successfully", newUser });
        }        
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error by signUp " });
    }
};


export const generateAndStoreOTP = async (userId) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 


  await prisma.emailVerification.deleteMany({
    where: { userId }
  });

  await prisma.emailVerification.create({
    data: {
      userId,
      otp,
      expiresAt,
    },
  });

  return otp; 
};

export const sendEmailOTP = async (req,res) => {
    const { userId,email} = req.body;
    try {
        const otp = await generateAndStoreOTP(userId);
    
        const response = await sendMail({
          to: email,
          subject: "Welcome to Our Platform",
          html: `<div style="max-width: 600px; margin: auto; padding: 30px; background-color: #f4f4f4; font-family: Arial, sans-serif; border-radius: 10px; color: #333;">
                <div style="text-align: center;">
                <h2 style="color: #4CAF50;">Welcome to Buddy's 🚀</h2>
                <p style="font-size: 16px;">Hi there 👋,</p>
                <p style="font-size: 16px;">Thank you for registering with us. To complete your signup, please use the OTP below to verify your email address:</p>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <p style="font-size: 20px; color: #4CAF50; font-weight: bold; letter-spacing: 3px;">${otp}</p>
                </div>

                <p style="font-size: 14px; text-align: center; color: #555;">
                  This OTP will expire in <strong>10 minutes</strong>. Please do not share it with anyone.
                </p>

                <hr style="border: none; border-top: 1px solid #ccc; margin: 40px 0;">

                <p style="font-size: 12px; text-align: center; color: #888;">
                  If you didn’t request this, you can safely ignore this email.<br>
                  Need help? Contact our support team anytime.
                </p>

                <div style="text-align: center; margin-top: 20px;">
                  <a href="https://google.com" style="color: #4CAF50; text-decoration: none; font-weight: bold;">Buddy's Team</a>
                </div>
                </div>
            `,
        });
        
        if(response.success){
            return res.status(200).json({ message: "OTP sent successfully" });
        }
        return res.status(500).json({ message: "Failed to send OTP" });
    } catch (error) {
        console.log("Error in sendEmailOTP:", error);
        return res.status(500).json({ message: "Internal server error " });        
    }
}


export const verifyUserOTP = async (userId, inputOtp) => {
     const record = await prisma.emailVerification.findUnique({
       where: { userId },
     });
   
     if (!record) {
       throw new Error("OTP not found. Please request a new one.");
     }
   
     if (record.otp !== inputOtp) {
       throw new Error("Invalid OTP.");
     }
   
     await prisma.user.update({
       where: { id: userId },
       data: { isVerified: true },
     });
   
     await prisma.emailVerification.delete({
       where: { userId },
     });
   
    return true;
};

export const emailVerifyOTP = async (req,res) => {
    const { userId, otp } = req.body;
    try {
        await verifyUserOTP(userId, otp);
    return res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
       return res.status(400).json({message:error.message});
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ message: "User does not exist" });
            return;
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        if(!user.isVerified){
            return res.status(400).json({ message: "Please verify your email" });
        }

        user.password = undefined;
        user.confirmpassword = undefined;
        const data = {
            id:user.id,
            role:user.role,
            isVerified:user.isVerified,
            email:user.email,
        }
        generateToken(res,data);
        return res.status(200).json({ message: "Login successful" ,user});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const me = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if(!user){
            return res.status(400).json({ message: "User does not exist" });
        }

       return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}
