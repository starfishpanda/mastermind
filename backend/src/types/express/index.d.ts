declare global {
  namespace Express {
    interface Request {
      user?: {
        userId?: string;
        username?: string;
        email?: string;
        // Other potential JWT payload fields
        [key: string]: any;
      };
    }
  }
}