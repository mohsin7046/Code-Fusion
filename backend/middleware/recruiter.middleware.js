import {verifyToken} from '../utilities/jwtUtility.js'
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const protectedRecruiter = async (req,res,next) =>{
   try {
    const token = req.cookies.token;

     if(!token) return res.status(401).json({message: 'Token not found'});
 
     const decodedToken = verifyToken(token); 
 
     if(!decodedToken){
      return res.status(401).json({message: 'Not Logged-In'})
    }

    if(decodedToken.isVerified === false){
        return res.status(401).json({message: 'Please verify your email'});
    }
      
    if(decodedToken.role !== 'RECRUITER'){
        return res.status(403).json({message: 'Access denied, not a recruiter'});
    }
    req.user = decodedToken;
    next();
    } catch (error) {
    return res.status(500).json({message: 'Internal Server Error'});
   }
}

export default protectedRecruiter;