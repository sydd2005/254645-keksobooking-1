'use strict';

const express = require(`express`);
const offers = require(`../data/offers.json`);

const HOST_NAME = `localhost`;
const DEFAULT_PORT = 3000;
const DEFAULT_LIMIT = 20;
const DEFAULT_SKIP_COUNT = 0;
const StatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const app = express();

app.use(express.static(`${__dirname}/../static/`));

app.get(`/api/offers`, (req, res) => {
  const offersLimit = req.query.limit || DEFAULT_LIMIT;
  const skipCount = req.query.skip || DEFAULT_SKIP_COUNT;
  if (!Number.isNaN(parseInt(offersLimit, 10)) && !Number.isNaN(parseInt(skipCount, 10))) {
    const data = offers.slice(skipCount).slice(0, offersLimit);
    const result = {
      data,
      skip: skipCount,
      limit: offersLimit,
      total: offers.length,
    };
    res.send(result);
    return;
  }
  const errorMessage = {
    status: StatusCode.BAD_REQUEST,
    description: `Неправильно указаны параметры!`,
  };
  res.status(StatusCode.BAD_REQUEST).send(errorMessage);
});

app.get(`/api/offers/:date`, (req, res) => {
  const requestDate = req.params.date;
  const foundResult = offers.find((it) => it.date === parseInt(requestDate, 10));
  if (foundResult) {
    res.send(foundResult);
    return;
  }
  const notFoundMessage = {
    status: StatusCode.NOT_FOUND,
    description: `Нет такого предложения!`,
  };
  res.status(StatusCode.NOT_FOUND).send(notFoundMessage);
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
