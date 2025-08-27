import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utilities/bcrpyt.js';
import { generateToken } from '../utilities/jwtUtility.js';
import { sendMail } from '../utilities/emailService.js';
import crypto from 'crypto';

const prisma = new PrismaClient();

export const signup = async (req, res) => {
    try {
        const { username, email, password, confirmpassword, role, skills, socialLinks, location, company_name, company_description, company_role, company_website, company_location } = req.body;
        let user;
        if (role === "CANDIDATE") {

            if (!email || !password || !username || !confirmpassword || skills.length === 0 || socialLinks.length === 0 || !location) {
                return res.status(400).json({ message: "All fields are required!!!" });
            }

            if (password !== confirmpassword) {
                return res.status(400).json({ message: "Passwords do not match!!!" });
            }
            
            user = await prisma.user.findUnique({ where: { email } });
        } else if (role === "RECRUITER") {
            if (!email || !password || !username || !confirmpassword || !company_name || !company_description || !company_role || !company_website || !company_location) {
                return res.status(400).json({ message: "All fields are required!!!" });
            }
            if (password !== confirmpassword) {
                return res.status(400).json({ message: "Passwords do not match!!!" });
            }
            user = await prisma.user.findUnique({ where: { email } });
        } else {
            return res.status(401).json({ message: "UnAuthorized Role Access!!!" })
        }

        if (user) {
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
        if (newUser) {
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

export const sendEmailOTP = async (req, res) => {
    const { userId, email } = req.body;
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

        if (response.success) {
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

export const emailVerifyOTP = async (req, res) => {
    const { userId, otp } = req.body;
    try {
        await verifyUserOTP(userId, otp);
        return res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        return res.status(400).json({ message: error.message });
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
            res.status(400).json({ success :false, message: "Invalid credentials" });
            return;
        }
        if (!user.isVerified) {
            return res.status(400).json({ success :false, message: "Please verify your email" });
        }

        user.password = undefined;
        user.confirmpassword = undefined;
        let data = {
            id: user.id,
            role: user.role,
            isVerified: user.isVerified,
            email: user.email,
            username: user.username,
            profilePicture: user.profilePicture,
            bio: user.bio,
        }
        let token;
        if (user.role === "RECRUITER") {
            token =  generateToken(res, data);
        }
        if (user.role === "CANDIDATE") {
            data.isDocumentUploaded = user.isUserDocumentUploaded;
            token =  generateToken(res, data);
        }
        res.cookie('token', token, {
            httpOnly: false,
            maxAge: 60 * 60 * 60*1000,
            sameSite: 'strict',
            secure:false,
        });
        return res.status(200).json({ success :true, message: "Login successful", user });
    } catch (error) {
        return res.status(500).json({ success :false, message: "Internal server error" });
    }
};



export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const rawtoken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(rawtoken).digest('hex')

        await prisma.passwordReset.upsert({
            where: { userId: user.id },
            update: { tokenHash, expiresAt: new Date(Date.now() + 15 * 60 * 1000) },
            create: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
        });
        const resetUrl = `${process.env.APP_URL}/reset-password?token=${rawtoken}&uid=${user.id}`;

        const response = await sendMail({
            to: user.email,
            subject: "Reset Your Password - CodeFusion Platform",
            html: `<div style="max-width: 600px; margin: auto; padding: 30px; background-color: #f4f4f4; font-family: Arial, sans-serif; border-radius: 10px; color: #333;">
        <div style="text-align: center;">
      <h2 style="color: #4CAF50;">Reset Your Password 🔐</h2>
      <p style="font-size: 16px;">Hi there 👋,</p>
      <p style="font-size: 16px;">We received a request to reset your password for your CodeFusion's account.</p>
      <p style="font-size: 16px;">Click the button below to choose a new password:</p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
        Reset Password
      </a>
    </div>

    <p style="font-size: 14px; text-align: center; color: #555;">
      This link will expire in <strong>15 minutes</strong> for your security.<br>
      If you didn't request this, you can safely ignore this email.
    </p>

    <hr style="border: none; border-top: 1px solid #ccc; margin: 40px 0;">

    <p style="font-size: 12px; text-align: center; color: #888;">
      Need help? Contact our support team anytime.
    </p>

    <div style="text-align: center; margin-top: 20px;">
      <a href="https://google.com" style="color: #4CAF50; text-decoration: none; font-weight: bold;">Buddy's Team</a>
    </div>
  </div>`,
        });

        if (!response.success) {
            return res.status(500).json({ message: "Failed to send reset email" });
        }
        return res.status(200).json({ message: "Reset email sent successfully" });

    } catch (error) {

        return res.status(500).json({ message: "Internal server error" });
    }
}


export const resetPassword = async (req,res) => {
    const {token ,uid, newpassword, confirmpassword} = req.body;
    try {
        if (!token || !uid || !newpassword || !confirmpassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (newpassword !== confirmpassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const userObj = await prisma.passwordReset.findUnique({where : {userId :uid}});
        
        if(!userObj || userObj.tokenHash !== tokenHash ){
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        if(userObj.used){
            return res.status(400).json({ message: "This reset link has already been used." });
        }

        if (userObj.expiresAt < new Date()) {
            return res.status(400).json({ message: "Token has expired" });
        }
        const hashedPassword = await hashPassword(newpassword);
        const hashedConfirmPassword = await hashPassword(confirmpassword);


        const user = await prisma.user.update({where :{id : uid},
            data : {
                password : hashedPassword,
                confirmpassword : hashedConfirmPassword
            }
        });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        await prisma.passwordReset.update({
      where: { userId: uid },
      data: { used: true },
    });
        
        const response = await sendMail({
            to: user.email,
            subject: "Your Password Was Successfully Changed - CodeFusion Platform",
            html: `<div style="max-width: 600px; margin: auto; padding: 30px; background-color: #f4f4f4; font-family: Arial, sans-serif; border-radius: 10px; color: #333;">
            <div style="text-align: center;">
            <h2 style="color: #4CAF50;">Password Changed ✅</h2>
            <p style="font-size: 16px;">Hi there 👋,</p>
            <p style="font-size: 16px;">We wanted to let you know that your Buddy's account password was successfully updated.</p>
            </div>

            <div style="text-align: center; margin: 30px 20px;">
            <p style="font-size: 14px; color: #555;">
            If you made this change, no further action is needed. You're all set! 🎉
            </p>
            <p style="font-size: 14px; color: #555;">
            If you did <strong>not</strong> change your password, please reset it immediately or contact our support team.
             </p>
            </div>

            <hr style="border: none; border-top: 1px solid #ccc; margin: 40px 0;">

            <p style="font-size: 12px; text-align: center; color: #888;">
                Need help? Our team is here for you 24/7.
            </p>

            <div style="text-align: center; margin-top: 20px;">
             <a href="https://google.com" style="color: #4CAF50; text-decoration: none; font-weight: bold;">Buddy's Team</a>
            </div>
            </div>`,
});

        if (!response.success) {
            return res.status(500).json({ message: "Failed to send confirmation email" });
        }

        return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

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
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}



export const getProfile = async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ error: "Email and role are required" });
  }

  try {
    let user;

    if (role === "RECRUITER") {
      
      user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          profilePicture: true,
          bio: true,
          location: true,
          company_name: true,
          company_description: true,
          company_role: true,
          company_website: true,
          company_location: true,
        },
      });
    } else if (role === "CANDIDATE") {
      
      user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          profilePicture: true,
          bio: true,
          location: true,
          skills: true,
          socialLinks: true,
        },
      });
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}


export const updateProfile = async (req, res) => {
    const {username,bio,userId} = req.body;
 console.log("Update Profile Data:", req.body);
 
    try{
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        const updatedData = {};
        if (username ) updatedData.username = username;
        if (bio) updatedData.bio = bio;
    

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: updatedData,
        });

        return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    }catch(error){
        return res.status(500).json({ message: "Internal server error" });
    }   
}
