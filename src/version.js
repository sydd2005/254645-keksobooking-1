'use strict';

require(`colors`);
const packageInfo = require(`../package.json`);

const getColoredVersion = () => {
  const [major, minor, patch] = packageInfo.version.split(`.`);
  return `${major.red}.${minor.green}.${patch.blue}`;
};

module.exports = {
  name: `version`,
  description: `печатает версию программы`,
  execute() {
    console.log(`v${getColoredVersion()}`);
  },
};
