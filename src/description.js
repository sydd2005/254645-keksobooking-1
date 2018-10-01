'use strict';

const packageInfo = require(`../package.json`);

module.exports = {
  name: `description`,
  description: `печатает описание приложения`,
  execute() {
    console.log(`${packageInfo.description}`);
  },
};
