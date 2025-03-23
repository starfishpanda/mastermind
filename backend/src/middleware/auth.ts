import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export interface AuthRequest extends Request {
  userId?: string;
}

// declare global {
//   namespace Express {
//     interface Request {
//       user?: JWTPayload;
//     }
//   }
// }

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader){
    return res.status(401).json({ message: "Authentication required."} )
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: "Invalid authentication format." });
  }
  const token = parts[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  if (!config.jwt.secret) {
    console.error("JWT_SECRET not defined in environment variables")
    return res.status(500).json( {message: "Server configuration error."})
  }
  
  try {
    const decoded = jwt.verify(token,config.jwt.secret) as {userId: string}

    req.userId = decoded.userId
    next();
  } catch (error: any){
    console.error('JWT verification error:', error);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
 
};