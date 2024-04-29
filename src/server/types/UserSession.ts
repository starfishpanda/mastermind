import { Session } from 'express-session';

interface UserSession extends Session {
  userId?: string;
}

export default UserSession;