import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utilities/bcrpyt.js';
import { generateToken } from '../utilities/jwtUtility.js';


const prisma = new PrismaClient();

export const signup = async (req, res) => {
    try {
        const { username, email, password, confirmpassword } = req.body;
        if (!email || !password || !username || !confirmpassword) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }
        if (password !== confirmpassword) {
            res.status(400).json({ message: "Passwords do not match" });
            return;
        }
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const hashedPassword = await hashPassword(password);
        const confirmHashedPassword = await hashPassword(confirmpassword);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                confirmpassword: confirmHashedPassword
            }
        });
        newUser.password = undefined;
        newUser.confirmpassword = undefined;
        if(newUser){
           generateToken(res,newUser.id);
         return res.status(201).json({ message: "User created successfully" ,newUser});
        } 
        
    } catch (error) {
        res.status(500).json({ message: "Internal server error by signUp " });
    }
};

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
        user.password = undefined;
        generateToken(res,user.id);
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
