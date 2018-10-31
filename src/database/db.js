'use strict';

const {MongoClient} = require(`mongodb`);

const DB_URL = `mongodb://localhost:27017`;
const DB_NAME = `keksobooking`;

const getDb = async () => {
  let db;
  try {
    const dbClient = await MongoClient.connect(DB_URL, {useNewUrlParser: true});
    db = dbClient.db(DB_NAME);
  } catch (error) {
    console.error(`Не удалось подключиться к базе`, error);
    process.exit(1);
  }
  return db;
};

module.exports = {
  db: getDb(),
};
