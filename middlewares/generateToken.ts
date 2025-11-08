import jwt from "jsonwebtoken";

 const generateToken = (userId: string): string => {
  const secret = process.env.SECRET_KEY;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  return jwt.sign({ id: userId }, secret, { expiresIn: "30d" });
};

export default generateToken;