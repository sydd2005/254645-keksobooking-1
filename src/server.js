'use strict';

const express = require(`express`);
const {GridFSBucket} = require(`mongodb`);
const {getDb} = require(`./database/db`);
const OffersStore = require(`./offers/offers-store`);
const ImagesStore = require(`./images/images-store`);
const {createOffersRouter} = require(`./offers/offers-router`);

const HOST_NAME = `localhost`;
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

  const port = process.argv.slice(2)[1] || DEFAULT_PORT;
  app.listen(port, HOST_NAME, () => {
    console.log(`сервер запущен на http://${HOST_NAME}:${port}`);
  });

};

module.exports = {
  name: `server`,
  description: `запускает http-сервер на указанном порту, по-умолчанию на ${DEFAULT_PORT}`,
  execute,
};
