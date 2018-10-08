'use strict';

const fs = require(`fs`);
const {promisify} = require(`util`);

const writeFile = promisify(fs.writeFile);

const saveFile = async (filePathToSave, dataToSave, overwriteIfExists = false) => {
  const flag = overwriteIfExists ? `w` : `wx`;
  await writeFile(filePathToSave, dataToSave, {flag});
  console.log(`Запись данных произведена успешно!`);
  return true;
};

module.exports = {
  saveFile,
};
