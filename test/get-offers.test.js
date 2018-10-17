'use strict';

const request = require(`supertest`);
const assert = require(`assert`);
const {app} = require(`../src/server`);

describe(`GET /api/offers`, async () => {

  it(`should return non-empty array of offers`, async () => {
    const response = await request(app)
    .get(`/api/offers`)
    .set(`Accept`, `application/json`)
    .expect(200)
    .expect(`Content-Type`, /json/);

    const offers = response.body.data;
    assert.ok(Array.isArray(offers));
    assert.strictEqual(offers.length, 20);
    assert.ok(offers[offers.length - 1].offer);
    return response;
  });

  it(`should return limited array of offers with length of 10`, async () => {
    const response = await request(app)
    .get(`/api/offers/?limit=10`)
    .set(`Accept`, `application/json`)
    .expect(200)
    .expect(`Content-Type`, /json/);

    const limitedOffers = response.body.data;
    assert.ok(Array.isArray(limitedOffers));
    assert.strictEqual(limitedOffers.length, 10);
  });

  it(`should return array of offers skipping first 70 with length of 7`, async () => {
    const response = await request(app)
    .get(`/api/offers/?skip=70`)
    .set(`Accept`, `application/json`)
    .expect(200)
    .expect(`Content-Type`, /json/);

    const limitedOffers = response.body.data;
    assert.ok(Array.isArray(limitedOffers));
    assert.strictEqual(limitedOffers.length, 7);
  });

  it(`should return limited array of offers skipping first 70 with length of 5`, async () => {
    const response = await request(app)
    .get(`/api/offers/?skip=70&limit=5`)
    .set(`Accept`, `application/json`)
    .expect(200)
    .expect(`Content-Type`, /json/);

    const limitedOffers = response.body.data;
    assert.ok(Array.isArray(limitedOffers));
    assert.strictEqual(limitedOffers.length, 5);
  });

  it(`should return limited array of offers skipping first 50 with length of 3`, async () => {
    const response = await request(app)
    .get(`/api/offers/?limit=3&skip=50`)
    .set(`Accept`, `application/json`)
    .expect(200)
    .expect(`Content-Type`, /json/);

    const limitedOffers = response.body.data;
    assert.ok(Array.isArray(limitedOffers));
    assert.strictEqual(limitedOffers.length, 3);
  });

  it(`should return 400 with bad value of limit parameter`, async () => {
    const response = await request(app)
      .get(`/api/offers/?limit=js8`)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /json/);

    const badArgumentsMessage = response.body;
    assert.strictEqual(badArgumentsMessage.description, `Неправильно указаны параметры!`);
  });

  it(`should return 400 with bad value of skip parameter`, async () => {
    const response = await request(app)
      .get(`/api/offers/?skip=jaipq`)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /json/);

    const badArgumentsMessage = response.body;
    assert.strictEqual(badArgumentsMessage.description, `Неправильно указаны параметры!`);
  });

});

describe(`GET /api/offers/:date`, () => {

  it(`should return single offer`, async () => {
    const response = await request(app)
      .get(`/api/offers/1539378808609`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);

    const offer = response.body;
    assert.strictEqual(typeof offer, `object`);
    assert.ok(offer.offer);
    assert.strictEqual(offer.offer.address, `747, 427`);
  });

  it(`should return 404 on nonexistent offer`, async () => {
    const response = await request(app)
      .get(`/api/offers/1112223334445`)
      .set(`Accept`, `application/json`)
      .expect(404)
      .expect(`Content-Type`, /json/);

    const notFoundMessage = response.body;
    assert.strictEqual(notFoundMessage.description, `Нет такого предложения!`);
  });

});
