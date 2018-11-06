'use strict';

const {MongoClient} = require(`mongodb`);
const logger = require(`../logger`);

const DEFAULT_DB_URL = `mongodb://localhost:27017`;
const DEFAULT_DB_NAME = `keksobooking`;

const getConnection = async () => {
  let connection;
  try {
    const dbUrl = process.env.DB_URL || DEFAULT_DB_URL;
    connection = await MongoClient.connect(dbUrl, {useNewUrlParser: true});
  } catch (error) {
    logger.error(`Не удалось установить соединение с mongoDB`, error);
    process.exit(1);
  }
  return connection;
};

const getDb = async (existingConnection) => {
  let db;
  try {
    const connection = existingConnection || await getConnection();
    const dbName = process.env.DB_NAME || DEFAULT_DB_NAME;
    db = connection.db(dbName);
  } catch (error) {
    logger.error(`Не удалось подключиться к базе`, error);
    process.exit(1);
  }
  return db;
};

module.exports = {
  getConnection,
  getDb,
};
