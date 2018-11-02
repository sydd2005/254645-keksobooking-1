'use strict';

const express = require(`express`);
const multer = require(`multer`);
const NotFoundError = require(`../custom-errors/not-found-error`);
const {validateParams} = require(`../validation/validate-params`);
const {validateOffer} = require(`../validation/validate-offer`);
const {wrapAsync, takeRandomItem} = require(`../utils`);
const toStream = require(`buffer-to-stream`);
const logger = require(`../logger`);

const DEFAULT_LIMIT = 20;
const DEFAULT_SKIP_COUNT = 0;
const NAMES = [`Keks`, `Pavel`, `Nikolay`, `Alex`, `Ulyana`, `Anastasyia`, `Julia`];

const createOffersRouter = (offersStore, imagesStore) => {
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
    const offersResult = await offersStore.getOffers(params);
    res.send(offersResult);
  }));

  offersRouter.get(`/:date`, wrapAsync(async (req, res) => {
    const requestDate = parseInt(req.params.date, 10);
    const foundResult = await offersStore.getOffer(requestDate);
    if (!foundResult) {
      throw new NotFoundError(`Нет такого предложения!`);
    }
    res.send(foundResult);
  }));

  offersRouter.get(`/:date/avatar`, wrapAsync(async (req, res) => {
    const requestDate = parseInt(req.params.date, 10);
    const foundOffer = await offersStore.getOffer(requestDate);
    if (!foundOffer) {
      throw new NotFoundError(`Нет такого предложения!`);
    }

    const foundImage = await imagesStore.getAvatar(foundOffer._id);
    if (!foundImage) {
      throw new NotFoundError(`Аватар этого предложения не найден!`);
    }

    res.header(`Content-Type`, `image/png`);
    res.header(`Content-Length`, foundImage.fileInfo.length);
    res.on(`error`, (err) => logger.error(err));
    res.on(`end`, () => res.end());

    const imageStream = foundImage.stream;
    imageStream.on(`error`, (err) => logger.error(err));
    imageStream.on(`end`, () => res.end());

    imageStream.pipe(res);
  }));

  offersRouter.post(``, jsonParser, multiParser, wrapAsync(async (req, res, next) => {
    const offer = Object.assign({}, req.body);
    offer.guests = parseInt(offer.guests, 10);
    offer.price = parseInt(offer.price, 10);
    offer.rooms = parseInt(offer.rooms, 10);

    let avatar;
    let preview;
    if (req.files) {
      avatar = req.files[`avatar`] ? req.files[`avatar`][0] : null;
      preview = req.files[`preview`] ? req.files[`preview`][0] : null;
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
      const validatedOffer = await validateOffer(offer);
      validatedOffer.name = validatedOffer.name || takeRandomItem(NAMES);
      const {insertedId} = await offersStore.saveOffer(validatedOffer);

      const fileWrites = [];
      if (avatar) {
        fileWrites.push(imagesStore.saveAvatar(insertedId, toStream(avatar.buffer)));
      }
      if (preview) {
        fileWrites.push(imagesStore.savePreview(insertedId, toStream(preview.buffer)));
      }
      await Promise.all(fileWrites);
      res.send(validatedOffer);
    } catch (error) {
      next(error);
    }
  }));

  offersRouter.use((err, req, res, _next) => {
    res.status(err.statusCode).send(err);
  });

  return offersRouter;
};

module.exports = {
  createOffersRouter,
};
