'use strict';

const request = require(`supertest`);
const assert = require(`assert`);
const express = require(`express`);
const {createOffersRouter} = require(`../src/offers/offers-router`);
const {addErrorCatcher, addNotSupported} = require(`../src/middlewares`);

const offersRouter = createOffersRouter();

const app = express();
app.use(addNotSupported);
app.use(`/api/offers`, offersRouter);
app.use(addErrorCatcher);

describe(`Not supported methods`, async () => {

  it(`should return 501 for PUT request`, async () => {
    const response = await request(app)
      .put(`/api/offers/`)
      .send(`nothing`)
      .set(`Accept`, `application/json`)
      .expect(501)
      .expect(`Content-Type`, /json/);

    const formattedErrors = response.body;
    assert.strictEqual(formattedErrors[0].error, `Метод не поддерживается`);
  });

  it(`should return 501 for DELETE request`, async () => {
    const response = await request(app)
      .delete(`/api/offers/`)
      .send(`25`)
      .set(`Accept`, `application/json`)
      .expect(501)
      .expect(`Content-Type`, /json/);

    const formattedErrors = response.body;
    assert.strictEqual(formattedErrors[0].error, `Метод не поддерживается`);
  });

});
