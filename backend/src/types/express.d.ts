declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        email: string;
        role: string;
        id?: string;
        _id?: string;
        institutionId?: string | null;
      };
      institutionId?: string | null;
    }
  }
}

declare module 'hpp' {
  import type { RequestHandler } from 'express';
  function hpp(options?: any): RequestHandler;
  export default hpp;
}

export {};
