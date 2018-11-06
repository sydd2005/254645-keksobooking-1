'use strict';

const AbstractError = require(`./abstract-error`);
const {StatusCode} = require(`../status-code`);

class WrongParamsError extends AbstractError {
  constructor(errors) {
    super(`Ошибка значений параметров запроса`);
    this.statusCode = StatusCode.BAD_REQUEST;
    this.errors = errors;
  }
}

module.exports = WrongParamsError;
