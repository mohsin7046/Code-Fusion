import jwt from 'jsonwebtoken';

const JWT_TOKEN = process.env.JWT_SECRET;

export const generateToken = (id) => {
  return jwt.sign({ id }, JWT_TOKEN, { expiresIn: process.env.JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_TOKEN);
};
