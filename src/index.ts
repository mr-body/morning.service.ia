import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import http from 'http';
import helmet from 'helmet';
import { Server } from 'socket.io';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';


import morningGminiRoutes from './routes/morning.gmini.routing';
import morningOllamaRoutes from './routes/morning.ollama.routing';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(helmet());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1/morning', morningGminiRoutes);
app.use('/api/v2/morning', morningOllamaRoutes);

app.get('/', (_, res: Response) => {
  res.sendFile(path.join(__dirname, 'public/html/index.html'));
});

app.set('io', io);


io.on('connection', (socket) => {
  socket.on('clientMessage', (message) => {
    console.log('front-end:', message);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(3003, () => {
  console.log(`Servidor rodando em http://localhost:3000`);
  console.log(`Documentação Swagger disponível em http://localhost:3000/api-docs`);
});
