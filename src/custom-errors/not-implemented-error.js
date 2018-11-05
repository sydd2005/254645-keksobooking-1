'use strict';

const AbstractError = require(`./abstract-error`);
const {StatusCode} = require(`../status-code`);

class NotImplementedError extends AbstractError {
  constructor(errorMessage) {
    super(errorMessage);
    this.statusCode = StatusCode.NOT_IMPLEMENTED;
    this.errors = [
      {
        error: `Метод не поддерживается`,
        errorMessage,
      },
    ];
  }
}

module.exports = NotImplementedError;
