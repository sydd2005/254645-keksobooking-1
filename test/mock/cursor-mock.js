'use strict';

class CursorMock {

  constructor(documents) {
    this.documents = documents;
  }

  skip(count = 0) {
    return new CursorMock(this.documents.slice(count));
  }

  limit(count = 0) {
    return new CursorMock(this.documents.slice(0, count));
  }

  async toArray() {
    return this.documents;
  }

  async count() {
    return this.documents.length;
  }
}

module.exports = CursorMock;
