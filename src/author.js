'use strict';

require(`colors`);
const packageInfo = require(`../package.json`);

module.exports = {
  name: `author`,
  description: `печатает автора приложения`,
  execute() {
    console.log(`Автор: ${packageInfo.author.green}`);
  },
};
