import jwt from 'jsonwebtoken';

const JWT_TOKEN = process.env.JWT_SECRET;

export const generateToken = (res,id) => {
  const token = jwt.sign({ id }, JWT_TOKEN, { expiresIn:"1min" });

   res.cookie('token', token, {
    httpOnly: true,
    maxAge: 60*1000,
    secure:false,
    sameSite: 'strict',
  });

  return token;
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_TOKEN);
};
