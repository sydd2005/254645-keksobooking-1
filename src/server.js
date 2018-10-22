'use strict';

const express = require(`express`);
const offersRouter = require(`./offers-router`);

const HOST_NAME = `localhost`;
const DEFAULT_PORT = 3000;

const app = express();

app.use(express.static(`${__dirname}/../static/`));

app.use(`/api/offers`, offersRouter);

app.use((err, req, res, _next) => {
  res.status(err.statusCode).send(err);
});

const execute = () => {
  const port = process.argv.slice(2)[1] || DEFAULT_PORT;
  app.listen(port, HOST_NAME, () => {
    console.log(`сервер запущен на http://${HOST_NAME}:${port}`);
  });
};

module.exports = {
  name: `server`,
  description: `запускает http-сервер на указанном порту, по-умолчанию на ${DEFAULT_PORT}`,
  execute,
  app,
};
