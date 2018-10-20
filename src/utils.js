'use strict';

const isInteger = (numberLike) => {
  return !Number.isNaN(parseInt(numberLike, 10));
};

module.exports = {
  isInteger,
};
