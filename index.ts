import express, { Response } from 'express';
import { port, dbPort, dbName, dbHost } from './src/config/enviroment';
import formData from 'express-form-data';
import Router from './src/api/router';
import mongoose from 'mongoose';
const cors = require('cors');

const app = express();

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
app.use('**', (_, res: Response) => res.sendStatus(404));

/**
 * mongodb configuration
 */
mongoose.set('runValidators', true);
const db = mongoose
  .connect(`mongodb://${dbHost}:${dbPort}/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log('error connecting to db : ', error);
  });

export default app;
