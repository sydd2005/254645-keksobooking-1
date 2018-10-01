'use strict';

const colors = require(`colors/safe`);
const author = require(`./author`);
const packageDescription = require(`./description`);
const license = require(`./license`);
const version = require(`./version`);

const commands = [
  author,
  packageDescription,
  license,
  version,
];

const name = `help`;
const description = `печатает справочную информацию`;
commands.unshift({name, description});

const commandsInfo = commands.map((command) => `--${colors.grey(command.name)} — ${colors.green(command.description)}`).join(`;\n`) + `.`;
module.exports = {
  name,
  description,
  execute() {
    console.log(`Доступные команды:
${commandsInfo}`);
  },
};
