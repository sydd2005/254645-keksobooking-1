'use strict';

const author = require(`./author`);
const description = require(`./description`);
const empty = require(`./empty`);
const help = require(`./help`);
const license = require(`./license`);
const version = require(`./version`);
const unknown = require(`./unknown`);

const unknownCommandSymbol = Symbol(`unknown command`);

const CommandType = {
  AUTHOR: `--author`,
  DESCRIPTION: `--description`,
  HELP: `--help`,
  LICENSE: `--license`,
  VERSION: `--version`,
  EMPTY: ``,
  UNKNOWN: unknownCommandSymbol,
};

const COMMAND_MAP = {
  [CommandType.AUTHOR]: author,
  [CommandType.DESCRIPTION]: description,
  [CommandType.EMPTY]: empty,
  [CommandType.HELP]: help,
  [CommandType.LICENSE]: license,
  [CommandType.VERSION]: version,
  [CommandType.UNKNOWN]: unknown,
};

const commandType = process.argv.slice(2)[0] || CommandType.EMPTY;
const command = COMMAND_MAP[commandType];

if (command !== undefined) {
  command.execute();
} else {
  COMMAND_MAP[CommandType.UNKNOWN].execute(commandType);
  process.exit(1);
}
