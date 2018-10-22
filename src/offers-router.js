'use strict';

const express = require(`express`);
const multer = require(`multer`);
const NotFoundError = require(`./custom-errors/not-found-error`);
const {validateParams} = require(`./validation/validate-params`);
const {validateOffer} = require(`./validation/validate-offer`);
const offers = require(`../data/offers.json`);

const DEFAULT_LIMIT = 20;
const DEFAULT_SKIP_COUNT = 0;

// eslint-disable-next-line new-cap
const offersRouter = express.Router();
const jsonParser = express.json();
const multiParser = multer().none();

offersRouter.get(``, (req, res) => {
  const params = {
    limit: req.query.limit || DEFAULT_LIMIT,
    skip: req.query.skip || DEFAULT_SKIP_COUNT,
  };
  validateParams(params);
  const data = offers.slice(params.skip).slice(0, params.limit);
  const result = {
    data,
    skip: params.skip,
    limit: params.limit,
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
  const offer = Object.assign({}, req.body);
  offer.guests = parseInt(offer.guests, 10);
  offer.price = parseInt(offer.price, 10);
  offer.rooms = parseInt(offer.rooms, 10);
  res.send(validateOffer(offer));
});

module.exports = offersRouter;
