'use strict';

const assert = require(`assert`);
const request = require(`supertest`);
const express = require(`express`);
const OffersStore = require(`../src/offers/offers-store`);
const ImagesStore = require(`../src/images/images-store`);
const {createOffersRouter} = require(`../src/offers/offers-router`);
const dbMock = require(`./mock/db-mock`);
const GridFSBucketMock = require(`./mock/gridfs-bucket-mock`);

const offersStore = new OffersStore(dbMock);
const bucketFactory = {
  createBucket(db, options) {
    return new GridFSBucketMock(db, options);
  }
};
const imagesStore = new ImagesStore(dbMock, bucketFactory);
const offersRouter = createOffersRouter(offersStore, imagesStore);

const app = express();
app.use(`/api/offers`, offersRouter);

const DATA_SAMPLE = {
  name: `Pavel`,
  title: `Маленькая квартирка рядом с парком`,
  address: `570, 472`,
  price: 30000,
  type: `flat`,
  rooms: 1,
  guests: 1,
  checkin: `14:00`,
  checkout: `12:00`,
  features: [`elevator`, `conditioner`]
};

const DATA_SAMPLE_ADDITION = {
  location: {
    x: 570,
    y: 472,
  }
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

    const expectedResult = Object.assign({}, DATA_SAMPLE, DATA_SAMPLE_ADDITION);
    assert.deepStrictEqual(response.body, expectedResult);
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

    const expectedResult = Object.assign({}, DATA_SAMPLE, DATA_SAMPLE_ADDITION);
    assert.deepStrictEqual(response.body, expectedResult);
    return response;
  });

  it(`should accept correct avatar`, async () => {
    const response = await request(app)
    .post(`/api/offers`)
    .field(DATA_SAMPLE)
    .attach(`avatar`, `test/fixtures/default.png`)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `multipart/form-data`)
    .expect(200)
    .expect(`Content-Type`, /json/);

    const avatar = response.body.avatar;
    assert.deepStrictEqual(avatar, {name: `default.png`, mimetype: `image/png`});

    return response;
  });

  it(`should accept correct preview`, async () => {
    const response = await request(app)
    .post(`/api/offers`)
    .field(DATA_SAMPLE)
    .attach(`preview`, `test/fixtures/keks.png`)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `multipart/form-data`)
    .expect(200)
    .expect(`Content-Type`, /json/);

    const preview = response.body.preview;
    assert.deepStrictEqual(preview, {name: `keks.png`, mimetype: `image/png`});

    return response;
  });

  it(`should respond with 400 and title validation error when title is empty`, async () => {
    const badSample = Object.assign({}, DATA_SAMPLE);
    badSample.title = ``;

    const response = await request(app)
    .post(`/api/offers`)
    .send(badSample)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = response.body;
    assert.ok(errors.length > 0);

    const titleError = errors.find((error) => error.fieldName === `title`);
    assert.ok(titleError);

    return response;
  });

  it(`should respond with 400 and title validation error when title shorter than 30 characters`, async () => {
    const badSample = Object.assign({}, {title: `короткое название`});

    const response = await request(app)
    .post(`/api/offers`)
    .send(badSample)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = response.body;
    assert.ok(errors.length > 0);

    const titleError = errors.find((error) => error.fieldName === `title`);
    assert.ok(titleError);

    return response;
  });

  it(`should respond with 400 and title validation error when title longer than 140 characters`, async () => {
    const badSample = Object.assign({}, DATA_SAMPLE, {title: `a`.repeat(141)});

    const response = await request(app)
    .post(`/api/offers`)
    .send(badSample)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = response.body;
    assert.ok(errors.length > 0);

    const titleError = errors.find((error) => error.fieldName === `title`);
    assert.ok(titleError);

    return response;
  });

  it(`should respond with 400 and type validation error when type is empty`, async () => {
    const badSample = Object.assign({}, DATA_SAMPLE, {type: ``});

    const response = await request(app)
    .post(`/api/offers`)
    .send(badSample)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = response.body;
    assert.ok(errors.length > 0);

    const typeError = errors.find((error) => error.fieldName === `type`);
    assert.ok(typeError);

    return response;
  });

  it(`should respond with 400 and type validation error when type is not from whitelist`, async () => {
    const badSample = Object.assign({}, DATA_SAMPLE, {type: `wrong`});

    const response = await request(app)
    .post(`/api/offers`)
    .send(badSample)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = response.body;
    assert.ok(errors.length > 0);

    const typeError = errors.find((error) => error.fieldName === `type`);
    assert.ok(typeError);

    return response;
  });

  it(`should respond with 400 and price validation error when price is empty`, async () => {
    const badSample = Object.assign({}, DATA_SAMPLE, {price: undefined});

    const response = await request(app)
    .post(`/api/offers`)
    .send(badSample)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = response.body;
    assert.ok(errors.length > 0);

    const priceError = errors.find((error) => error.fieldName === `price`);
    assert.ok(priceError);

    return response;
  });

  it(`should respond with 400 and price validation error when price is less than 1`, async () => {
    const badSample = Object.assign({}, DATA_SAMPLE, {price: 0});

    const response = await request(app)
    .post(`/api/offers`)
    .send(badSample)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = response.body;
    assert.ok(errors.length > 0);

    const priceError = errors.find((error) => error.fieldName === `price`);
    assert.ok(priceError);

    return response;
  });

  it(`should respond with 400 and price validation error when price greater than 100 000`, async () => {
    const badSample = Object.assign({}, DATA_SAMPLE, {price: 100001});

    const response = await request(app)
    .post(`/api/offers`)
    .send(badSample)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = response.body;
    assert.ok(errors.length > 0);

    const priceError = errors.find((error) => error.fieldName === `price`);
    assert.ok(priceError);

    return response;
  });

  it(`should respond with 400 and address validation error when address is empty`, async () => {
    const badSample = Object.assign({}, DATA_SAMPLE, {address: ``});

    const response = await request(app)
    .post(`/api/offers`)
    .send(badSample)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = response.body;
    assert.ok(errors.length > 0);

    const addressError = errors.find((error) => error.fieldName === `address`);
    assert.ok(addressError);

    return response;
  });

  it(`should respond with 400 and address validation error when address longer than 99 characters`, async () => {
    const badSample = Object.assign({}, DATA_SAMPLE, {address: `b`.repeat(100)});

    const response = await request(app)
    .post(`/api/offers`)
    .send(badSample)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = response.body;
    assert.ok(errors.length > 0);

    const addressError = errors.find((error) => error.fieldName === `address`);
    assert.ok(addressError);

    return response;
  });

  it(`should respond with 400 and checkin validation error when checkin doesn't conform with HH:mm format`, async () => {
    const badSample = Object.assign({}, DATA_SAMPLE, {checkin: `9:00`});

    const response = await request(app)
    .post(`/api/offers`)
    .send(badSample)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = response.body;
    assert.ok(errors.length > 0);

    const checkinError = errors.find((error) => error.fieldName === `checkin`);
    assert.ok(checkinError);

    return response;
  });

  it(`should respond with 400 and checkout validation error when checkout doesn't conform with HH:mm format`, async () => {
    const badSample = Object.assign({}, DATA_SAMPLE, {checkout: `13:77`});

    const response = await request(app)
    .post(`/api/offers`)
    .send(badSample)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = response.body;
    assert.ok(errors.length > 0);

    const checkoutError = errors.find((error) => error.fieldName === `checkout`);
    assert.ok(checkoutError);

    return response;
  });

  it(`should respond with 400 and rooms validation error when rooms is empty`, async () => {
    const badSample = Object.assign({}, DATA_SAMPLE, {rooms: undefined});

    const response = await request(app)
    .post(`/api/offers`)
    .send(badSample)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = response.body;
    assert.ok(errors.length > 0);

    const roomsError = errors.find((error) => error.fieldName === `rooms`);
    assert.ok(roomsError);

    return response;
  });

  it(`should respond with 400 and rooms validation error when rooms is negative`, async () => {
    const badSample = Object.assign({}, DATA_SAMPLE, {rooms: -1});

    const response = await request(app)
    .post(`/api/offers`)
    .send(badSample)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = response.body;
    assert.ok(errors.length > 0);

    const roomsError = errors.find((error) => error.fieldName === `rooms`);
    assert.ok(roomsError);

    return response;
  });

  it(`should respond with 400 and rooms validation error when rooms greater than 1000`, async () => {
    const badSample = Object.assign({}, DATA_SAMPLE, {rooms: 1001});

    const response = await request(app)
    .post(`/api/offers`)
    .send(badSample)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = response.body;
    assert.ok(errors.length > 0);

    const roomsError = errors.find((error) => error.fieldName === `rooms`);
    assert.ok(roomsError);

    return response;
  });

  it(`should accept empty features`, async () => {
    const response = await request(app)
    .post(`/api/offers`)
    .send(Object.assign({}, DATA_SAMPLE, {features: []}))
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(200)
    .expect(`Content-Type`, /json/);

    return response;
  });

  it(`should accept features with empty array`, async () => {
    const response = await request(app)
    .post(`/api/offers`)
    .send(Object.assign({}, DATA_SAMPLE, {features: []}))
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(200)
    .expect(`Content-Type`, /json/);

    return response;
  });

  it(`should respond with 400 and features validation error when features have non-whitelist values`, async () => {
    const badSample = Object.assign({}, DATA_SAMPLE, {features: [`wifi`, `wrong`]});

    const response = await request(app)
    .post(`/api/offers`)
    .send(badSample)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = response.body;
    assert.ok(errors.length > 0);

    const featuresError = errors.find((error) => error.fieldName === `features`);
    assert.ok(featuresError);

    return response;
  });

  it(`should respond with 400 and features validation error when features have duplicate values`, async () => {
    const badSample = Object.assign({}, DATA_SAMPLE, {features: [`wifi`, `wifi`]});

    const response = await request(app)
    .post(`/api/offers`)
    .send(badSample)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = response.body;
    assert.ok(errors.length > 0);

    const featuresError = errors.find((error) => error.fieldName === `features`);
    assert.ok(featuresError);

    return response;
  });

  it(`should respond with 400 and avatar validation error`, async () => {
    const response = await request(app)
    .post(`/api/offers`)
    .field(DATA_SAMPLE)
    .attach(`avatar`, `test/fixtures/textfile.txt`)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `multipart/form-data`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = response.body;
    assert.ok(errors.length > 0);

    const avatarError = errors.some((error) => error.fieldName === `avatar`);
    assert.ok(avatarError);

    return response;
  });

  it(`should respond with 400 and preview validation error`, async () => {
    const response = await request(app)
    .post(`/api/offers`)
    .field(DATA_SAMPLE)
    .attach(`preview`, `test/fixtures/textfile.txt`)
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `multipart/form-data`)
    .expect(400)
    .expect(`Content-Type`, /json/);

    const errors = response.body;
    assert.ok(errors.length > 0);

    const previewError = errors.some((error) => error.fieldName === `preview`);
    assert.ok(previewError);

    return response;
  });

  it(`should accept empty name`, async () => {
    const response = await request(app)
    .post(`/api/offers`)
    .send(Object.assign({}, DATA_SAMPLE, {name: undefined}))
    .set(`Accept`, `application/json`)
    .set(`Content-Type`, `application/json`)
    .expect(200)
    .expect(`Content-Type`, /json/);

    return response;
  });

});
