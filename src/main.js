'use strict';

const empty = require(`./empty`);
const help = require(`./help`);
const unknownCommand = require(`./unknown`);
const availableCommands = require(`./commands`);

const EMPTY_COMMAND = ``;
const COMMAND_PREFIX = `--`;

const commands = availableCommands.concat([help, empty]);

const commandName = (process.argv.slice(2)[0] || EMPTY_COMMAND);
const command = commands.find((item) => item.name === commandName.slice(COMMAND_PREFIX.length));

if (command !== undefined) {
  command.execute();
} else {
  unknownCommand.execute(commandName);
  process.exit(1);
}
