'use strict';

const helpCommand = require(`./help`);

const UNKNOWN_COMMAND_MESSAGE = `Неизвестная команда {0}.`;

const interpolateString = (target, ...values) => {
  return target.replace(/\{(\d)\}/g, (match, index) => values[index]);
};

module.exports = {
  name: `unknown`,
  description: `Печатает список доступных команд с описанием`,
  execute(command) {
    console.error(interpolateString(UNKNOWN_COMMAND_MESSAGE, command));
    helpCommand.execute();
  },
};
