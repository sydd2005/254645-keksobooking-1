'use strict';

const unknownCommandSymbol = Symbol(`unknown command`);

const CommandType = {
  VERSION: `--version`,
  HELP: `--help`,
  EMPTY: ``,
  UNKNOWN: unknownCommandSymbol,
};

const COMMAND_MESSAGE_MAP = {
  [CommandType.VERSION]: `v0.0.1`,
  [CommandType.HELP]: `Доступные команды:
--help    — печатает этот текст;
--version — печатает версию приложения;`,
  [CommandType.EMPTY]: `Привет пользователь!
Эта программа будет запускать сервер «Кексобукинг».
Автор: Спиридонов Дмитрий.`,
  [CommandType.UNKNOWN]: `Неизвестная команда {0}.
Чтобы прочитать правила использования приложения, наберите "--help"`,
};

const interpolateString = (target, ...values) => {
  return target.replace(/\{(\d)\}/g, (match, index) => values[index]);
};

const commandType = process.argv.slice(2)[0] || CommandType.EMPTY;
const commandMessage = COMMAND_MESSAGE_MAP[commandType];

if (commandMessage !== undefined) {
  console.log(commandMessage);
} else {
  console.error(interpolateString(COMMAND_MESSAGE_MAP[CommandType.UNKNOWN], commandType));
  process.exit(1);
}
