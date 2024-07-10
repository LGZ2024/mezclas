import express from 'express';
import fileUpload from "express-fileupload";
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from '../routes/users.routes.js';
import loginRoutes from '../routes/login.routes.js';
import CentroCostesRoutes from '../routes/centro.routes.js';
import mesclasRoutes from '../routes/mesclas.routes.js';

export const startServer = async (options) => {
  const {PORT,SECRET_JWT_KEY} = options;

  const app = express();

  app.use(fileUpload());
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(cors());           

  //middleeare de cookieParse
  app.use((req, res, next) => {
    const token = req.cookies.accessToken;
    req.session = { user: null };
    try {
      const data = jwt.verify(token,SECRET_JWT_KEY);
      req.session.user = data;
    } catch (error) { };
    next(); //seguir a la siguiente ruta o Middleware
  });


  app.use(express.static('public')); //contenido estatico que ponemos disponible

  // Routes del servidor
  app.use('/', loginRoutes);
  app.use('/', userRoutes);
  app.use('/', CentroCostesRoutes);
  app.use('/', mesclasRoutes);

  app.get('/*', (req, res) => {
    const indexPath = path.resolve(__dirname, `../../../public/index.html`);
    res.sendFile(indexPath);
  });

  app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
  });
};