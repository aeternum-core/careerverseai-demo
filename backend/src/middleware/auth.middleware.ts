import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'careerverse_cosmic_jwt_key_2026';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
    email: string;
  };
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization token required.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired authorization token.' });
  }
}

export function authorizeRoles(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = (req as any).user?.role;
    if (!userRole || !roles.includes(userRole)) {
      res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
      return;
    }
    next();
  };
}
