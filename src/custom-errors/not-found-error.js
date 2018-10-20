'use strict';

const {StatusCode} = require(`../status-code`);

const NotFoundError = class extends Error {
  constructor(errorMessage) {
    super(errorMessage);
    this.statusCode = StatusCode.NOT_FOUND;
  }
};

module.exports = NotFoundError;
