'use strict';

const colors = require(`colors/safe`);
const packageInfo = require(`../package.json`);

module.exports = {
  name: `license`,
  description: `печатает тип лицензии`,
  execute() {
    console.log(`Лицензия: ${colors.bold(packageInfo.license)}`);
  },
};
