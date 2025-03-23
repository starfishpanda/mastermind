import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });
// interface JwtConfig {
//   secret: string;
//   expiresIn: string | number; // expiresIn can be a number (seconds) or a string (e.g., "1h")
// }

const NODE_ENV = process.env.NODE_ENV || 'development';

export const config = {
  env: NODE_ENV,
  port: process.env.PORT || 3000,
  mongodb: {
    uri: NODE_ENV === 'production'
      ? process.env.MONGODB_URI // Your cloud cluster URI
      : 'mongodb://localhost:27017/mastermind', // Local development URI
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h'
  },
  bcrypt: {
    saltRounds: parseInt(process.env.SALT_ROUNDS || '10', 10),
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  frontend: {
    url: NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:5173',
  },
} as const;