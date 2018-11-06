'use strict';

const {getConnection, getDb} = require(`./database/db`);
const {generateEntity} = require(`./generate-entity`);
const OffersStore = require(`./offers/offers-store`);
const logger = require(`./logger`);

const TEST_DATA_COUNT = 77;

const fillDatabase = async () => {
  const connection = await getConnection();
  const offersStore = new OffersStore(getDb(connection));
  const testData = [];
  for (let i = 0; i < TEST_DATA_COUNT; i++) {
    testData.push(generateEntity());
  }
  await Promise.all(testData.map((offer) => offersStore.saveOffer(offer)));
  console.log(`База данных заполнена тестовыми данными!`);
  connection.close();
};

const execute = () => {
  fillDatabase().catch((error) => logger.error(error.message));
};

module.exports = {
  name: `fill`,
  description: `заполняет базу данных тестовыми данными`,
  execute,
};
