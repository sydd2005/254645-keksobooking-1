'use strict';

const assert = require(`assert`);
const request = require(`supertest`);
const {app} = require(`../src/server`);

const DATA_SAMPLE = {
  "name": `Pavel`,
  "title": `Маленькая квартирка рядом с парком`,
  "address": `570, 472`,
  "description": `Маленькая чистая квратира на краю парка. Без интернета, регистрации и СМС.`,
  "price": 30000,
  "type": `flat`,
  "rooms": 1,
  "guests": 1,
  "checkin": `9:00`,
  "checkout": `7:00`,
  "features": [`elevator`, `conditioner`]
};

describe(`POST /api/offers`, async () => {

  it(`should respond with the same data sample, sent as json`, async () => {
    const response = await request(app)
    .post(`/api/offers`)
    .send(DATA_SAMPLE)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(200)
    .expect(`Content-Type`, /json/);

    assert.deepStrictEqual(response.body, DATA_SAMPLE);
    return response;
  });

  it(`should respond with the same data sample, sent as multipart/form-data`, async () => {
    const response = await request(app)
    .post(`/api/offers`)
    .field(DATA_SAMPLE)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `multipart/form-data`)
    .expect(200)
    .expect(`Content-Type`, /json/);

    assert.deepStrictEqual(response.body, DATA_SAMPLE);
    return response;
  });

  it(`should respond with 400 and title required validation error`, async () => {
    const badSample = {
      title: ``,
    };
    const response = await request(app)
    .post(`/api/offers`)
    .send(badSample)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = JSON.parse(response.body);
    assert.ok(errors.length > 0);

    const titleRequiredError = errors.find((it) => it.fieldName === `title` && it.errorMessage === `is required`);
    assert.ok(titleRequiredError);

    return response;
  });

});
