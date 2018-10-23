'use strict';

const Joi = require(`joi`);
const ValidationError = require(`../custom-errors/validation-error`);

const TIME_PATTERN = /^(([01][0-9])|(2[0-3])):[0-5][0-9]$/;
const VALID_OFFER_TYPES = [`flat`, `house`, `bungalo`, `palace`];
const VALID_FEATURES = [`dishwasher`, `elevator`, `conditioner`, `parking`, `washer`, `wifi`];
const VALIDATION_OPTIONS = {
  abortEarly: false,
  convert: false,
};

const validationSchema = Joi.object().keys({
  title: Joi.string().min(30).max(140).required(),
  type: Joi.string().only(VALID_OFFER_TYPES),
  price: Joi.number().integer().min(1).max(100000).required(),
  address: Joi.string().max(99).required(),
  checkin: Joi.string().regex(TIME_PATTERN).required(),
  checkout: Joi.string().regex(TIME_PATTERN).required(),
  rooms: Joi.number().integer().min(0).max(1000).required(),
  guests: Joi.number().integer().required(),
  features: Joi.array().items(VALID_FEATURES.map((feature) => Joi.string().valid(feature))).unique().optional(),
  avatar: Joi.object().keys({
    name: Joi.string().required(),
    mimetype: Joi.string().regex(/^image\//).required(),
  }),
  preview: Joi.object().keys({
    name: Joi.string().required(),
    mimetype: Joi.string().regex(/^image\//).required(),
  }),
  name: Joi.string().optional(),
});

const validateOffer = (offer) => {
  return new Promise((resolve) => {
    Joi.validate(offer, validationSchema, VALIDATION_OPTIONS, (error, value) => {
      if (error) {
        const errors = error.details;
        const formattedErrors = errors.map((validationError) => {
          return {
            error: `Validation Error`,
            fieldName: validationError.path[0],
            errorMessage: validationError.message,
          };
        });
        throw new ValidationError(formattedErrors);
      }
      resolve(value);
    });
  });
};

module.exports = {
  validateOffer,
};
