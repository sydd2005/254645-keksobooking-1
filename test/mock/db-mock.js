'use strict';

const CollectionMock = require(`./collection-mock`);
const mockData = require(`./mock-offers.json`);

const COLLECTION_NAME = `offers`;

class DbMock {

  constructor() {
    this.data = mockData;
  }

  getCollection() {
    if (!this._collection) {
      this._collection = new CollectionMock(this.data);
    }
    return this._collection;
  }

  collection(collectionName) {
    if (collectionName !== COLLECTION_NAME) {
      throw new Error(`Замена базы данных работает только с коллекцией "${COLLECTION_NAME}"`);
    }
    return this.getCollection();
  }

}

module.exports = Promise.resolve(new DbMock());
