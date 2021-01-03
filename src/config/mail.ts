import { createTransport } from 'nodemailer';
import { mailHost, mailPort, mailPass, mailUser } from './enviroment';

export default createTransport({
  host: mailHost,
  port: mailPort,
  auth: {
    pass: mailPass,
    user: mailUser,
  },
});
