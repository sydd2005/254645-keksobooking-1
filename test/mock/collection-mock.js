'use strict';

const CursorMock = require(`./cursor-mock`);

class CollectionMock {

  constructor(documents) {
    this.documents = documents;
  }

  find() {
    return new CursorMock(this.documents);
  }

  async findOne({date}) {
    return Promise.resolve(this.documents.find((it) => it.date === parseInt(date, 10)));
  }

  async insertOne(_document) {
    return {
      insertedId: 2018,
    };
  }
}

module.exports = CollectionMock;
