'use strict';

const fs = require(`fs`);
const CursorMock = require(`./cursor-mock`);

class GridFSBucketMock {

  constructor(db, options) {
    this._db = db;
    this._options = options;
  }

  find(_query) {
    const files = [
      {
        length: 64 * 1024,
      },
    ];
    return new CursorMock(files);
  }

  openDownloadStreamByName(_name) {
    return fs.createReadStream(`${__dirname}/mocked-image.png`);
  }

  openUploadStream(_name) {
    return fs.createWriteStream(`${__dirname}/mocked-image.png`, {flags: `w`});
  }
}

module.exports = GridFSBucketMock;
