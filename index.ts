import cors from 'cors';
import express, { Response } from 'express';
import formData from 'express-form-data';
import mongoose from 'mongoose';
import Router from './src/api/router';
import { dbHost, dbName, dbPort, port } from './src/config/enviroment';
import setupServer from './src/utils/setup';

const app = express(); // create new instance of express

/**
 * server configuration
 */
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(formData.parse());

/**
 * routing configuration
 */
app.use('/api/v0/', Router);
app.use('**', (_, res: Response) => res.sendStatus(404)); // if the route is not found send 404

/**
 * mongodb configuration
 */
mongoose.set('runValidators', true); // to run the schema validation on creation and on update
const db = mongoose
  .connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    /**
     * start server if only connected to database
     */
    app.listen(port, () => {
      /**
       * if server is running than setup the server
       * create admin if not exist
       * create regions if does not exist
       */
      setupServer();
      console.log(`listening on port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.log('error connecting to db : ', error.message);
  });

export default app;
