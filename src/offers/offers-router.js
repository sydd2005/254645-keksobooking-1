'use strict';

const express = require(`express`);
const multer = require(`multer`);
const NotFoundError = require(`../custom-errors/not-found-error`);
const {validateParams} = require(`../validation/validate-params`);
const {validateOffer} = require(`../validation/validate-offer`);
const {wrapAsync, takeRandomItem} = require(`../utils`);

const DEFAULT_LIMIT = 20;
const DEFAULT_SKIP_COUNT = 0;
const NAMES = [`Keks`, `Pavel`, `Nikolay`, `Alex`, `Ulyana`, `Anastasyia`, `Julia`];

// eslint-disable-next-line new-cap
const offersRouter = express.Router();
const jsonParser = express.json();
const multiParser = multer({storage: multer.memoryStorage()})
                    .fields([
                      {name: `avatar`, maxCount: 1},
                      {name: `preview`, maxCount: 1},
                    ]);

offersRouter.get(``, wrapAsync(async (req, res, _next) => {
  const params = {
    limit: req.query.limit || DEFAULT_LIMIT,
    skip: req.query.skip || DEFAULT_SKIP_COUNT,
  };
  validateParams(params);
  const offersResult = await offersRouter.offersStore.getOffers(params); // offers.slice(params.skip).slice(0, params.limit);
  res.send(offersResult);
}));

offersRouter.get(`/:date`, wrapAsync(async (req, res) => {
  const requestDate = parseInt(req.params.date, 10);
  const foundResult = await offersRouter.offersStore.getOffer(requestDate); // offers.find((it) => it.date === parseInt(requestDate, 10));
  if (!foundResult) {
    throw new NotFoundError(`Нет такого предложения!`);
  }
  res.send(foundResult);
}));

offersRouter.post(``, jsonParser, multiParser, wrapAsync(async (req, res, next) => {
  let offer = Object.assign({}, req.body);
  offer.guests = parseInt(offer.guests, 10);
  offer.price = parseInt(offer.price, 10);
  offer.rooms = parseInt(offer.rooms, 10);

  if (req.files) {
    const avatar = req.files[`avatar`] ? req.files[`avatar`][0] : null;
    const preview = req.files[`preview`] ? req.files[`preview`][0] : null;
    if (avatar) {
      offer.avatar = {
        name: avatar.originalname,
        mimetype: avatar.mimetype,
      };
    }
    if (preview) {
      offer.preview = {
        name: preview.originalname,
        mimetype: preview.mimetype,
      };
    }
  }

  try {
    // TODO: save offer to database here
    const validatedOffer = await validateOffer(offer);
    validatedOffer.name = validatedOffer.name || takeRandomItem(NAMES);
    res.send(validatedOffer);
  } catch (error) {
    next(error);
  }
}));

offersRouter.use((err, req, res, _next) => {
  res.status(err.statusCode).send(err);
});

module.exports = {
  createOffersRouter: (offersStore) => {
    offersRouter.offersStore = offersStore;
    return offersRouter;
  },
};
