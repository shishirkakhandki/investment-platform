// src/auth/custom.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Or a specific type for your decoded JWT data
    }
  }
}
