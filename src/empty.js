'use strict';

const readline = require(`readline`);
const fs = require(`fs`);
const {promisify} = require(`util`);
const {generateEntity} = require(`./generate-entity`);

const AnswerType = {
  POSITIVE: `y`,
  NEGATIVE: `n`,
};

const ELEMENTS_COUNT = {
  min: 1,
  max: 10,
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const writeFile = promisify(fs.writeFile);

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
};

const execute = async () => {
  console.log(`Привет, пользователь!`);

  let canProceed = false;
  while (!canProceed) {
    const shouldDataBeGenerated = (await question(`Сгенерировать данные? (${AnswerType.POSITIVE}/${AnswerType.NEGATIVE}) `)).toLowerCase();
    if (shouldDataBeGenerated === AnswerType.NEGATIVE) {
      return rl.close();
    }
    canProceed = shouldDataBeGenerated === AnswerType.POSITIVE;
    if (!canProceed) {
      console.log(`Некорректный ответ: "${shouldDataBeGenerated}", выберите y(да) или n(нет).`);
    }
  }

  canProceed = false;
  let elementsAmount;
  while (!canProceed) {
    const answer = await question(`Сколько создать элементов? (${ELEMENTS_COUNT.min}-${ELEMENTS_COUNT.max}) `);
    elementsAmount = parseInt(answer, 10);
    canProceed = !Number.isNaN(elementsAmount) && elementsAmount >= ELEMENTS_COUNT.min && elementsAmount <= ELEMENTS_COUNT.max;
    if (!canProceed) {
      console.log(`Некорректный ответ: "${answer}", укажите число от ${ELEMENTS_COUNT.min} до ${ELEMENTS_COUNT.max}.`);
    }
  }

  const entities = [];
  for (let i = 0; i < elementsAmount; i++) {
    entities.push(generateEntity());
  }
  const dataToSave = JSON.stringify(entities);

  canProceed = false;
  while (!canProceed) {
    const filePathToSave = await question(`Укажите путь до файла, в котором сохранить данные: `);

    const saveFile = async (overwriteIfExists = false) => {
      const flag = overwriteIfExists ? `w` : `wx`;
      await writeFile(filePathToSave, dataToSave, {flag});
      canProceed = true;
      console.log(`Запись данных произведена успешно!`);
    };

    try {
      await saveFile();
    } catch (err) {
      if (err.code === `EEXIST`) {
        const answer = (await question(`Такой файл уже существует, перезаписать? (${AnswerType.POSITIVE}/${AnswerType.NEGATIVE}) `)).toLowerCase();
        const shouldOverwrite = answer === AnswerType.POSITIVE;
        if (shouldOverwrite) {
          await saveFile(true);
        }
      } else {
        console.error(`Ошибка: ${err.message}.`);
      }
    }
  }

  return rl.close();
};

module.exports = {
  name: ``,
  description: `интерактивная генерация данных с записью в файл`,
  execute,
};
