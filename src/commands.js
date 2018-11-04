'use strict';

const author = require(`./author`);
const fill = require(`./fill`);
const description = require(`./description`);
const license = require(`./license`);
const version = require(`./version`);
const server = require(`./server`);

const commands = [
  author,
  fill,
  description,
  license,
  version,
  server,
];

module.exports = commands;
