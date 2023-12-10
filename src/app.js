import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes';
import bodyParser from 'body-parser';
class App {
  constructor() {
    this.server = express();
    mongoose.set('strictQuery', false);

    mongoose.connect('mongodb+srv://dawanlago1:Dl%4091429400@cursinho.lfuys7n.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.middlewares();
    this.routes();
  }

  options = [
    cors({
      origin: '*',
      methods: '*',
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    }),
  ];

  middlewares() {
    this.server.use(options);
    this.server.use(express.static('../../../public'));
    this.server.use(bodyParser.json({ limit: '50mb' }));
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
