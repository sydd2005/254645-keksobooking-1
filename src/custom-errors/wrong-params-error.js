'use strict';

const {StatusCode} = require(`../status-code`);

const WrongParamsError = class extends Error {
  constructor(errorMessage) {
    super(errorMessage);
    this.statusCode = StatusCode.BAD_REQUEST;
  }
};

module.exports = WrongParamsError;
