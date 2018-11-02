'use strict';

const express = require(`express`);
const {GridFSBucket} = require(`mongodb`);
const {getDb} = require(`./database/db`);
const OffersStore = require(`./offers/offers-store`);
const ImagesStore = require(`./images/images-store`);
const {createOffersRouter} = require(`./offers/offers-router`);

const DEFAULT_HOST_NAME = `localhost`;
const DEFAULT_PORT = 3000;

const app = express();

const execute = async () => {

  const database = await getDb();
  const offersStore = new OffersStore(database);
  const bucketFactory = {
    createBucket(db, options) {
      return new GridFSBucket(db, options);
    }
  };
  const imagesStore = new ImagesStore(database, bucketFactory);
  const offersRouter = createOffersRouter(offersStore, imagesStore);

  app.use(express.static(`${__dirname}/../static/`));
  app.use(`/api/offers`, offersRouter);

  const port = parseInt(process.env.SERVER_PORT, 10) || DEFAULT_PORT;
  const hostname = process.env.SERVER_HOST || DEFAULT_HOST_NAME;
  app.listen(port, hostname, () => {
    console.log(`сервер запущен на http://${hostname}:${port}`);
  });

};

module.exports = {
  name: `server`,
  description: `запускает http-сервер на указанном порту, по-умолчанию на ${DEFAULT_PORT}`,
  execute,
};
