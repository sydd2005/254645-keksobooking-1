'use strict';

const author = require(`./author`);
const description = require(`./description`);
const empty = require(`./empty`);
const help = require(`./help`);
const license = require(`./license`);
const version = require(`./version`);
const unknownCommand = require(`./unknown`);

const EMPTY_COMMAND = ``;
const COMMAND_PREFIX = `--`;

const commands = [
  author,
  description,
  empty,
  help,
  license,
  version,
];

const commandName = (process.argv.slice(2)[0] || EMPTY_COMMAND).slice(COMMAND_PREFIX.length);
const command = commands.find((item) => item.name === commandName);

if (command !== undefined) {
  command.execute();
} else {
  unknownCommand.execute(commandName);
  process.exit(1);
}
