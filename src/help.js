'use strict';

module.exports = {
  name: `help`,
  description: `Печатает руководство по использованию программы`,
  execute() {
    console.log(`Доступные команды:
--help        — печатает этот текст;
--version     — печатает версию приложения;
--author      — печатает автора приложения;
--license     — печатает тип лицензии;
--description — печатает описание приложения.`);
  },
};
