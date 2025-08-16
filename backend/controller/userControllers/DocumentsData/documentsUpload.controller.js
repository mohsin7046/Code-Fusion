import cloudinary from "../../../utilities/cloudinaryConfig.js";
import streamifier from 'streamifier';
import { PrismaClient } from "@prisma/client";
import { generateToken } from '../../../utilities/jwtUtility.js';

const prisma = new PrismaClient();

const userDataUpload = async(req,res) =>{
try {
     const {
      collegeName,
      passingYear,
      course,
      specialization,
      tenthPercentage,
      twelfthPercentage,
      cgpa,
      userId
    } = req.body;

    if (!collegeName || !passingYear || !course || !specialization || !tenthPercentage || !twelfthPercentage || !cgpa || !userId) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    if(!req.files.resume || !req.files.tenth || !req.files.twelfth || !req.files.lastSem || req.files.length === 0){
        return res.status(400).json({ message: "All files are required!" });
    }

    let resumeUrl = await uploadToCloudinary(req.files.resume[0].buffer, "resume");
    let sscUrl = await uploadToCloudinary(req.files.tenth[0].buffer, "tenth");
    let hscUrl = await uploadToCloudinary(req.files.twelfth[0].buffer, "twelfth");
    let lastSemUrl = await uploadToCloudinary(req.files.lastSem[0].buffer, "lastSem");

    const newUserDoc = await prisma.userDocument.create({
      data: {
        collegeName,
        passingYear: parseInt(passingYear),
        degree: course,
        branch: specialization,
        resumeUrl : resumeUrl.secure_url,
        sscUrl : sscUrl.secure_url,
        sscPercentage: parseFloat(tenthPercentage),
        hscUrl : hscUrl.secure_url,
        hscPercentage: parseFloat(twelfthPercentage),
        lastSemesterMarksheet: lastSemUrl.secure_url,
        lastSemesterCGPA: parseFloat(cgpa),
      },
    });
    if (!newUserDoc) {
        return res.status(500).json({ message: "Failed to save user document" });
    }

    const userUpdate = await prisma.user.update({
        where: { id: userId },
        data: { isUserDocumentUploaded: true },
    });

    if(!userUpdate){
      return res.status(500).json({message: "Failed to update user"})
    }

    const data = {
      id: userUpdate.id,
      role: userUpdate.role,
      isVerified: userUpdate.isVerified,
      email: userUpdate.email,
      username: userUpdate.username,
      profilePicture: userUpdate.profilePicture,
      bio: userUpdate.bio,
      isUserDocumentUploaded: userUpdate.isUserDocumentUploaded
    }

    const token  = generateToken(res, data);
    res.cookie('token', token, {
      httpOnly: false,
      maxAge: 60 * 60 * 60*1000,
      sameSite: 'strict',
      secure:false,
    });

    return res.status(201).json({ message: "User document uploaded successfully and data saved to db", data: newUserDoc });
} catch (error) {
    console.error("Error in userDataUpload:", error.message);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
    });
}
}

// helper fuction to upload data;
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};



export default userDataUpload;