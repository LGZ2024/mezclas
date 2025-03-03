import { startServer } from './server/server.mjs'
import { envs } from './config/env.mjs';

(async () => {
  startServer({
    PORT: envs.PORT,
    MODE: envs.MODE
  })
})()
