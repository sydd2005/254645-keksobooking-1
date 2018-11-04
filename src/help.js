'use strict';

const colors = require(`colors/safe`);
const availableCommands = require(`./commands`);

const commands = availableCommands.slice();

const name = `help`;
const description = `печатает справочную информацию`;
commands.unshift({name, description});

const getCommandInfo = (command) => {
  const paramsInfo = command.paramsInfo || ``;
  return `--${colors.grey(command.name)} ${colors.grey(paramsInfo)}— ${colors.green(command.description)}`;
};
const commandsInfo = commands.map(getCommandInfo).join(`;\n`) + `.`;
module.exports = {
  name,
  description,
  execute() {
    console.log(`Доступные команды:
${commandsInfo}`);
  },
};
