import path from 'path';
import express from 'express';

import { getOptions, getServerURL, log } from '../utils';

let options = getOptions();
let {
  help: { server }
} = options;
let serverUrl = getServerURL(server, 'htt' + 'p');
let { port } = server;

let app = express();

app.use(
  '/help',
  express.static(path.join(__dirname, '..', '..', 'templates', 'help'))
);

app.listen(port, err => {
  if (err) {
    throw err;
  }
  log(`Listening at ${serverUrl}/help/`);
});
