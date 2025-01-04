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
        const token = generateToken(newUser.id);
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
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
        const token = generateToken(user.id);
        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
