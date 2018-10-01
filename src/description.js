'use strict';

const colors = require(`colors/safe`);
const packageInfo = require(`../package.json`);

module.exports = {
  name: `description`,
  description: `печатает описание приложения`,
  execute() {
    console.log(`${colors.green(packageInfo.description)}`);
  },
};
