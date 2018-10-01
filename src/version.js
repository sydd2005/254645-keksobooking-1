'use strict';

const colors = require(`colors/safe`);
const packageInfo = require(`../package.json`);

const getColoredVersion = () => {
  const [major, minor, patch] = packageInfo.version.split(`.`);
  return `${colors.red(major)}.${colors.green(minor)}.${colors.blue(patch)}`;
};

module.exports = {
  name: `version`,
  description: `печатает версию программы`,
  execute() {
    console.log(`v${getColoredVersion()}`);
  },
};
