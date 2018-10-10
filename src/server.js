'use strict';

const http = require(`http`);
const url = require(`url`);
const fs = require(`fs`);
const path = require(`path`);

const HOST_NAME = `localhost`;
const DEFAULT_PORT = 3000;
const DEFAULT_PAGE = `index.html`;
const StatusCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
const EXTENSION_MIME_MAP = {
  '': `text/plain`,
  'css': `text/css`,
  'html': `text/html; charset=UTF-8`,
  'jpg': `image/jpeg`,
  'ico': `image/x-icon`,
  'png': `image/png`,
  'gif': `image/gif`,
};

const writeServerError = (error, response) => {
  response.writeHead(StatusCode.INTERNAL_SERVER_ERROR, error.message, {'Content-Type': `text/plain`});
  response.end(error.message);
};

const requestListener = (request, response) => {
  const pathname = url.parse(request.url).pathname.slice(1) || DEFAULT_PAGE;
  const filePath = `${__dirname}/../static/${pathname}`;
  const mimeType = EXTENSION_MIME_MAP[path.extname(pathname).slice(1)];

  try {
    if (mimeType) {
      response.setHeader(`Content-Type`, mimeType);
    }
    const fileReadStream = fs.createReadStream(filePath);
    fileReadStream.on(`error`, (error) => {
      if (error.code === `ENOENT`) {
        response.writeHead(StatusCode.NOT_FOUND, `Not found`);
        response.end();
        return;
      }
      writeServerError(error, response);
    });
    fileReadStream.pipe(response);
  } catch (error) {
    writeServerError(error, response);
  }
};

const execute = () => {
  const server = http.createServer(requestListener);
  const port = process.argv.slice(2)[1] || DEFAULT_PORT;
  server.listen(port, HOST_NAME, () => {
    console.log(`сервер запущен на http://${HOST_NAME}:${port}`);
  });
};

module.exports = {
  name: `server`,
  description: `запускает http-сервер на указанном порту, по-умолчанию на ${DEFAULT_PORT}`,
  execute,
};
