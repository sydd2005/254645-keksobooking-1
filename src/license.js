'use strict';

require(`colors`);
const packageInfo = require(`../package.json`);

module.exports = {
  name: `license`,
  description: `печатает тип лицензии`,
  execute() {
    console.log(`Лицензия: ${packageInfo.license.bold}`);
  },
};
