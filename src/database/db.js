'use strict';

const {MongoClient} = require(`mongodb`);

const DEFAULT_DB_URL = `mongodb://localhost:27017`;
const DEFAULT_DB_NAME = `keksobooking`;

const getDb = async () => {
  let db;
  try {
    const dbUrl = process.env.DB_URL || DEFAULT_DB_URL;
    const dbName = process.env.DB_NAME || DEFAULT_DB_NAME;
    const dbClient = await MongoClient.connect(dbUrl, {useNewUrlParser: true});
    db = dbClient.db(dbName);
  } catch (error) {
    console.error(`Не удалось подключиться к базе`, error);
    process.exit(1);
  }
  return db;
};

module.exports = {
  getDb,
};
