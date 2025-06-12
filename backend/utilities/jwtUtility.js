import jwt from 'jsonwebtoken';

const JWT_TOKEN = process.env.JWT_SECRET;

export const generateToken = (res,data) => {
  const token = jwt.sign(data, JWT_TOKEN, { expiresIn:"1min" });

  console.log(token);
  

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
