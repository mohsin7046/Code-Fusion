import jwt from 'jsonwebtoken';

const JWT_TOKEN = process.env.JWT_SECRET;

export const generateToken = (res,data) => {
  const token = jwt.sign(data, JWT_TOKEN, { expiresIn:"60hr" });

  console.log(token);
  return token;
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_TOKEN);
};

export const updateToken = (res,data)=>{
  const token = jwt.sign(data, JWT_TOKEN, { expiresIn:"60hr" });
  res.cookie('jobToken', token, {
    httpOnly: false,
    sameSite: 'Strict',
    maxAge: 60 * 60 * 1000
  });
  return token;
}