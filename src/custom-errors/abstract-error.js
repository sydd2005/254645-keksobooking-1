'use strict';

class AbstractError extends Error {
  toJSON() {
    return this.errors;
  }
}

module.exports = AbstractError;
