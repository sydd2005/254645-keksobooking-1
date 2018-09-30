'use strict';

const UNKNOWN_COMMAND_MESSAGE = `Неизвестная команда {0}.
Доступные команды:
--help        — печатает этот текст;
--version     — печатает версию приложения;
--author      — печатает автора приложения;
--license     — печатает тип лицензии;
--description — печатает описание приложения.`;

const interpolateString = (target, ...values) => {
  return target.replace(/\{(\d)\}/g, (match, index) => values[index]);
};

module.exports = {
  name: `unknown`,
  description: `Печатает список доступных команд с описанием`,
  execute(command) {
    console.error(interpolateString(UNKNOWN_COMMAND_MESSAGE, command));
  },
};
