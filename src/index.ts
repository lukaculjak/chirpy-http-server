import express from 'express';
import type { Express, Request, Response, NextFunction } from 'express';
import { handlerReadiness } from './api/readiness.js';
import { handlerHits, handlerResetHits } from './api/hits.js';
import { config } from './config.js';

const app: Express = express();
const port = 8080;

// new middleware funciton
function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
  res.on("finish", () => {
    const statusCode = res.statusCode;
    const httpMethod = res.req.method;
    const relativeUrl = res.req.originalUrl;

    if (!(statusCode >=200 && statusCode <= 299)) {
      console.log(`[NON-OK] ${httpMethod} ${relativeUrl} - Status: ${statusCode}`);
    }
  })

  next();
}

function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  config.fileserverHits++;
  next();
}

app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc);

app.use("/app", express.static("./src/app"));

app.get("/healthz", handlerReadiness);
app.get("/metrics", handlerHits);
app.get("/reset", handlerResetHits);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

