import express from 'express';
import type { Express } from 'express';
import { handlerReadiness } from './api/readiness.js';

const app: Express = express();
const port = 8080;

// new middleware funciton
function middlewareLogResponses(req: any, res: any, next: any) {
  res.on("finish", () => {
    const statusCode = res.statusCode;
    const httpMethod = res.req.method;
    const relativeUrl = res.req.originalUrl;

    if (statusCode != "OK" && !(statusCode >=200 && statusCode <= 299)) {
      console.log(`[NON-OK] ${httpMethod} ${relativeUrl} - Status: ${statusCode}`);
    }
  })

  next();
}

app.use(middlewareLogResponses);

app.use("/app", express.static("./src/app"));

app.get("/healthz", handlerReadiness);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

