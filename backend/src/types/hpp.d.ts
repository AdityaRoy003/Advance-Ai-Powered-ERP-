declare module 'hpp' {
  import type { RequestHandler } from 'express';
  function hpp(options?: {
    checkQuery?: boolean;
    checkBody?: boolean;
    whitelist?: string[] | string;
  }): RequestHandler;
  export = hpp;
}
