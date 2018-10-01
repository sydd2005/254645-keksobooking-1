'use strict';

const commands = [];
commands.push(require(`./author`));
commands.push(require(`./description`));
commands.push(require(`./empty`));
commands.push(require(`./help`));
commands.push(require(`./license`));
commands.push(require(`./version`));
const unknownCommand = require(`./unknown`);

const EMPTY_COMMAND = ``;
const COMMAND_PREFIX = `--`;

const commandName = (process.argv.slice(2)[0] || EMPTY_COMMAND).slice(COMMAND_PREFIX.length);
const command = commands.find((command) => command.name === commandName);

if (command !== undefined) {
  command.execute();
} else {
  unknownCommand.execute(commandName);
  process.exit(1);
}
