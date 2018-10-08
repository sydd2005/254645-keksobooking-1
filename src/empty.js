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

const questionCyclically = async (cycleCallback, callbackParams) => {
  let result = {
    canProceed: false,
    shouldBreak: false,
  };
  while (!result.canProceed && !result.shouldBreak) {
    result = await cycleCallback(...callbackParams);
    if (!result || !result.canProceed && result.retryMessage && !result.shouldBreak) {
      console.log(result.retryMessage);
    }
  }
  return result;
};

const askForDataGeneration = async () => {
  const answer = (await question(`Сгенерировать данные? (${AnswerType.POSITIVE}/${AnswerType.NEGATIVE}) `)).toLowerCase();
  return {
    answer,
    canProceed: answer === AnswerType.POSITIVE,
    shouldBreak: answer === AnswerType.NEGATIVE,
    retryMessage: `Некорректный ответ: "${answer}", выберите y(да) или n(нет).`,
  };
};

const askForElementsAmount = async () => {
  const answer = await question(`Сколько создать элементов? (${ELEMENTS_COUNT.min}-${ELEMENTS_COUNT.max}) `);
  const elementsAmount = parseInt(answer, 10);
  const canProceed = !Number.isNaN(elementsAmount) && elementsAmount >= ELEMENTS_COUNT.min && elementsAmount <= ELEMENTS_COUNT.max;
  const entities = [];
  if (canProceed) {
    for (let i = 0; i < elementsAmount; i++) {
      entities.push(generateEntity());
    }
  }
  return {
    answer,
    data: JSON.stringify(entities),
    canProceed: !Number.isNaN(elementsAmount) && elementsAmount >= ELEMENTS_COUNT.min && elementsAmount <= ELEMENTS_COUNT.max,
    shouldBreak: false,
    retryMessage: `Некорректный ответ: "${answer}", укажите число от ${ELEMENTS_COUNT.min} до ${ELEMENTS_COUNT.max}.`,
  };
};

const askForFilePathToSave = async (previousAnswerResult) => {
  const filePathToSave = await question(`Укажите путь до файла, в котором сохранить данные: `);
  let canProceed = false;
  let retryMessage = ``;
  try {
    canProceed = await saveFile(filePathToSave, previousAnswerResult.data);
  } catch (err) {
    if (err.code === `EEXIST`) {
      const answer = (await question(`Такой файл уже существует, перезаписать? (${AnswerType.POSITIVE}/${AnswerType.NEGATIVE}) `)).toLowerCase();
      const shouldOverwrite = answer === AnswerType.POSITIVE;
      if (shouldOverwrite) {
        canProceed = await saveFile(filePathToSave, previousAnswerResult.data, true);
      }
    } else {
      retryMessage = `Ошибка при попытке сохранения данных: ${err.message}.`;
    }
  }

  return {
    answer: filePathToSave,
    data: previousAnswerResult.data,
    canProceed,
    shouldBreak: false,
    retryMessage,
  };
};

const saveFile = async (filePathToSave, dataToSave, overwriteIfExists = false) => {
  const flag = overwriteIfExists ? `w` : `wx`;
  await writeFile(filePathToSave, dataToSave, {flag});
  console.log(`Запись данных произведена успешно!`);
  return true;
};

const execute = async () => {
  console.log(`Привет, пользователь!`);

  const questionHandlers = [
    askForDataGeneration,
    askForElementsAmount,
    askForFilePathToSave,
  ];

  let previousAnswerResult = {};
  for (const questionHandler of questionHandlers) {
    previousAnswerResult = await questionCyclically(questionHandler, [previousAnswerResult]);
    if (previousAnswerResult.shouldBreak) {
      return rl.close();
    }
  }

  return rl.close();
};

module.exports = {
  name: ``,
  description: `интерактивная генерация данных с записью в файл`,
  execute,
};
