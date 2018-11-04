'use strict';

const {isInteger} = require(`../utils`);
const WrongParamsError = require(`../custom-errors/wrong-params-error`);

const validateParams = (params) => {
  const errors = [];
  for (const key in params) {
    if (params.hasOwnProperty(key) && !isInteger(params[key])) {
      errors.push({
        error: `Wrong Parameter Error`,
        fieldName: key,
        errorMessage: `Некорректное значение параметра ${key}, ожидалось целое значение, указано - "${params[key]}".`
      });
    } else {
      params[key] = parseInt(params[key], 10);
    }
  }

  if (errors.length > 0) {
    throw new WrongParamsError(errors);
  }

  return params;
};

module.exports = {
  validateParams,
};
