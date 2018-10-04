'use strict';

const readline = require(`readline`);

const AnswerType = {
  POSITIVE: `y`,
  NEGATIVE: `n`,
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
};

const execute = async () => {
  console.log(`Привет, пользователь!`);

  let acceptableAnswer = false;
  while (!acceptableAnswer) {
    const shouldDataBeGenerated = (await question(`Сгенерировать данные? (${AnswerType.POSITIVE}/${AnswerType.NEGATIVE}) `)).toLowerCase();
    if (shouldDataBeGenerated === AnswerType.NEGATIVE) {
      return rl.close();
    }
    acceptableAnswer = shouldDataBeGenerated === AnswerType.POSITIVE;
  }

  acceptableAnswer = false;
  while (!acceptableAnswer) {
    const elementsAmount = parseInt(await question(`Сколько создать элементов? (1-10) `), 10);
    acceptableAnswer = !Number.isNaN(elementsAmount) && elementsAmount >= 1 && elementsAmount <= 10;
    if (acceptableAnswer) {
      console.log(`генерируем ${elementsAmount} элементов...`);
    }
  }

  return rl.close();
};

module.exports = {
  name: ``,
  description: `интерактивная генерация данных с записью в файл`,
  execute,
};
