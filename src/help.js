'use strict';

const commands = [];
commands.push(require(`./author`));
commands.push(require(`./description`));
commands.push(require(`./license`));
commands.push(require(`./version`));

const name = `help`;
const description = `печатает справочную информацию`;
commands.unshift({name, description});

const commandsInfo = commands.map((command) => `--${command.name} — ${command.description}`).join(`;\n`) + `.`;
module.exports = {
  name,
  description,
  execute() {
    console.log(`Доступные команды:
${commandsInfo}`);
  },
};
