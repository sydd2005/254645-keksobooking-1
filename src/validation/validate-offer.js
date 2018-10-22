'use strict';

const ValidationError = require(`../custom-errors/validation-error`);

const validateOffer = (offer) => {
  const errors = [];
  if (!offer.title) {
    errors.push({
      error: `Validation Error`,
      fieldName: `title`,
      errorMessage: `is required`,
    });
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  return offer;
};

module.exports = {
  validateOffer,
};
