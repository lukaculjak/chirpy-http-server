import { config } from '../config.js';
import type { Request, Response } from 'express';

export function handlerHits(req: Request, res: Response){
  res.send(`Hits: ${config.fileserverHits}`);
};

export function handlerResetHits(req: Request, res: Response) {
  config.fileserverHits = 0;
  res.send("OK");
};
