'use strict';

const isInteger = (numberLike) => {
  return !Number.isNaN(parseInt(numberLike, 10));
};

const wrapAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const takeRandomItem = (sourceArray) => {
  return sourceArray[Math.floor(Math.random() * sourceArray.length)];
};

module.exports = {
  isInteger,
  wrapAsync,
  takeRandomItem,
};
