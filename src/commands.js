'use strict';

const author = require(`./author`);
const description = require(`./description`);
const license = require(`./license`);
const version = require(`./version`);
const server = require(`./server`);

const commands = [
  author,
  description,
  license,
  version,
  server,
];

module.exports = commands;
