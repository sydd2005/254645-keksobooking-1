'use strict';

const NotImplementedError = require(`./custom-errors/not-implemented-error`);
const {renderHtml} = require(`./renderer`);

const SUPPORTED_METHODS = [
  `GET`,
  `POST`,
];

const addNotSupported = (req, res, next) => {
  if (!SUPPORTED_METHODS.includes(req.method)) {
    throw new NotImplementedError();
  }
  next();
};

const addCORS = (req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Headers`, `Origin, X-Requester-With, Content-Type, Accept`);
  next();
};

const addErrorCatcher = (err, req, res, _next) => {
  const result = req.accepts(`text/html`) ? renderHtml(err) : err;
  res.status(err.statusCode).send(result);
};

const addHtmlRendering = (req, res, _next) => {
  const result = req.accepts(`text/html`) ? renderHtml(req.data) : req.data;
  res.send(result);
};

module.exports = {
  addNotSupported,
  addCORS,
  addErrorCatcher,
  addHtmlRendering,
};
