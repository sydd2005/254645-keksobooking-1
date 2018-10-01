'use strict';

const colors = require(`colors/safe`);
const packageInfo = require(`../package.json`);

module.exports = {
  name: `author`,
  description: `печатает автора приложения`,
  execute() {
    console.log(`Автор: ${colors.green(packageInfo.author)}`);
  },
};
