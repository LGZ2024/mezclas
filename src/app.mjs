import { startServer } from './server/server.mjs';
import { envs } from './config/env.mjs';

(async () => {
  startServer({
    PORT: envs.PORT,
    SECRET_JWT_KEY: envs.SECRET_JWT_KEY,
  });
})(); 