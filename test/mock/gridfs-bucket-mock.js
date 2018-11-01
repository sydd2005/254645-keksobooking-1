'use strict';

const fs = require(`fs`);
const {Writable, Readable} = require(`stream`);
const CursorMock = require(`./cursor-mock`);

class GridFSBucketMock {

  constructor(db, options) {
    this._db = db;
    this._options = options;
  }

  find(_query) {
    return new CursorMock();
  }

  openDownloadStreamByName(_name) {
    const readableStream = new Readable();
    setTimeout(() => {
      readableStream.emit(`close`);
    }, 1);
  }

  openUploadStream(_name) {
    // const writableStream = new Writable();
    // setTimeout(() => {
    //   writableStream.emit(`finish`);
    // }, 1);
    // return writableStream;
    return fs.createWriteStream(`${__dirname}/mocked-image.png`, {flags: `w`});
  }
}

module.exports = GridFSBucketMock;
