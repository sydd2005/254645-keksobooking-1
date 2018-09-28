'use strict';

const packageInfo = require(`../package.json`);

module.exports = {
  name: `license`,
  description: `Печатает тип лицензии`,
  execute() {
    console.log(`Лицензия: ${packageInfo.license}`);
  },
};
