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

  middlewares() {
    this.server.use(cors());
    this.server.use(express.static('../../../public'));
    this.server.use(bodyParser.json({ limit: '50mb' }));
    this.server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
    this.server.use(express.json({ limit: '50mb' }));
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
