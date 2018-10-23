'use strict';

const AbstractError = class extends Error {
  toJSON() {
    return this.errors;
  }
};

module.exports = AbstractError;
