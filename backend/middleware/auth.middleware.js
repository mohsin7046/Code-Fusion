import {verifyToken} from '../utilities/jwtUtility.js'
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const protectedRoutes = async (req,res,next) =>{
   try {
    const token = req.cookies.token;
    console.log("Cookies token received: ",token);
    
     if(!token) return res.status(401).json({message: 'Token not found'});
 
     const decodedToken = verifyToken(token); 
      console.log("Decoded Token Received: ",decodedToken);
 
     if(!decodedToken){
      return res.status(401).json({message: 'Not Logged-In'})
      }

      if(decodedToken.isVerified === false){
         return res.status(401).json({message: 'Please verify your email'});
      }
      
      const user = await prisma.user.findUnique({
        where: {
            id: decodedToken.id
         }
     })
 
     if(!user) return res.status(401).json({message: 'Unauthorized'});
     req.user = user;
     next();
    } catch (error) {
    return res.status(500).json({message: 'Internal Server Error'});
   }
}

export default protectedRoutes;