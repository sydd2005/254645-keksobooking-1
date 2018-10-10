'use strict';

const http = require(`http`);

const DEFAULT_PORT = 3000;

const execute = () => {
  const server = http.createServer((req, res) => {
    res.end(`hello from server`, `utf8`);
  });

  const port = process.argv.slice(2)[1] || DEFAULT_PORT;
  server.listen(port);
  console.log(`сервер запущен на порту ${port}...`);
};

module.exports = {
  name: `server`,
  description: `запускает http-сервер на указанном порту, по-умолчанию на ${DEFAULT_PORT}`,
  execute,
};
