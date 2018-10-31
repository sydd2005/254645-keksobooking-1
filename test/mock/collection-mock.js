'use strict';

const CursorMock = require(`./cursor-mock`);

class CollectionMock {

  constructor(documents) {
    this.documents = documents;
  }

  async find() {
    return Promise.resolve(new CursorMock(this.documents));
  }

  async findOne({date}) {
    return Promise.resolve(this.documents.find((it) => it.date === parseInt(date, 10)));
  }

  async insertOne(_document) {
    return 2018;
  }
}

module.exports = CollectionMock;
