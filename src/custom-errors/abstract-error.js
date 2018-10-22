'use strict';

const AbstractError = class extends Error {
  toJSON() {
    return JSON.stringify(this.errors);
  }
};

module.exports = AbstractError;
