'use strict';

const express = require(`express`);
const multer = require(`multer`);
const {isInteger} = require(`./utils`);
const WrongParamsError = require(`./custom-errors/wrong-params-error`);
const NotFoundError = require(`./custom-errors/not-found-error`);
const offers = require(`../data/offers.json`);

const DEFAULT_LIMIT = 20;
const DEFAULT_SKIP_COUNT = 0;

// eslint-disable-next-line new-cap
const offersRouter = express.Router();
const jsonParser = express.json();
const multiParser = multer().none();

offersRouter.get(``, (req, res) => {
  const offersLimit = req.query.limit || DEFAULT_LIMIT;
  const skipCount = req.query.skip || DEFAULT_SKIP_COUNT;
  if (!isInteger(offersLimit) || !isInteger(skipCount)) {
    throw new WrongParamsError(`Неправильно указаны параметры!`);
  }
  const data = offers.slice(skipCount).slice(0, offersLimit);
  const result = {
    data,
    skip: skipCount,
    limit: offersLimit,
    total: offers.length,
  };
  res.send(result);
});

offersRouter.get(`/:date`, (req, res) => {
  const requestDate = req.params.date;
  const foundResult = offers.find((it) => it.date === parseInt(requestDate, 10));
  if (!foundResult) {
    throw new NotFoundError(`Нет такого предложения!`);
  }
  res.send(foundResult);
});

offersRouter.post(``, jsonParser, multiParser, (req, res) => {
  const saveResult = Object.assign({}, req.body);
  saveResult.guests = parseInt(saveResult.guests, 10);
  saveResult.price = parseInt(saveResult.price, 10);
  saveResult.rooms = parseInt(saveResult.rooms, 10);
  res.send(saveResult);
});

module.exports = offersRouter;
