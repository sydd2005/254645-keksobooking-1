'use strict';

const assert = require(`assert`);
const {generateEntity} = require(`../src/generate-entity`);

describe(`generateEntity`, () => {

  it(`should be a function`, () => {
    assert.strictEqual(typeof generateEntity, `function`);
  });

  it(`should return object`, () => {
    assert.strictEqual(typeof generateEntity(), `object`);
  });

  it(`should have certain fields`, () => {
    const entity = generateEntity();
    assert.ok(entity.author);
    assert.ok(entity.offer);
    assert.ok(entity.location);
    assert.ok(entity.date);
  });

  it(`should have author with avatar url`, () => {
    const entity = generateEntity();
    assert.strictEqual(typeof entity.author.avatar, `string`);
  });

  it(`should have offer title of non-empty string`, () => {
    const entity = generateEntity();
    assert.strictEqual(typeof entity.offer.title, `string`);
    assert.ok(entity.offer.title.length > 0);
  });

  it(`should have location of x in [300, 900] interval`, () => {
    const entity = generateEntity();
    assert.ok(entity.location.x >= 300 && entity.location.x <= 900);
  });

  it(`should have location of y in [150, 500] interval`, () => {
    const entity = generateEntity();
    assert.ok(entity.location.y >= 150 && entity.location.y <= 500);
  });

  it(`should have offer address of non-empty string`, () => {
    const entity = generateEntity();
    assert.strictEqual(typeof entity.offer.address, `string`);
    assert.ok(entity.offer.address.length > 0);
  });

  it(`should have offer price in [1000, 1000000] interval`, () => {
    const entity = generateEntity();
    assert.ok(entity.offer.price >= 1000 && entity.offer.price <= 1000000);
  });

  it(`should have offer type of non-empty string`, () => {
    const entity = generateEntity();
    assert.strictEqual(typeof entity.offer.type, `string`);
    assert.ok(entity.offer.type.length > 0);
  });

  it(`should have offer rooms in [1, 5] interval`, () => {
    const entity = generateEntity();
    assert.ok(entity.offer.rooms >= 1 && entity.offer.rooms <= 5);
  });

  it(`should have offer guests in [1, 12] interval`, () => {
    const entity = generateEntity();
    assert.ok(entity.offer.guests >= 1 && entity.offer.guests <= 12);
  });

  it(`should have offer checkin of non-empty string`, () => {
    const entity = generateEntity();
    assert.strictEqual(typeof entity.offer.checkin, `string`);
    assert.ok(entity.offer.checkin.length > 0);
  });

  it(`should have offer checkout of non-empty string`, () => {
    const entity = generateEntity();
    assert.strictEqual(typeof entity.offer.checkout, `string`);
    assert.ok(entity.offer.checkout.length > 0);
  });

  it(`should have offer features which is array with no more than 6 elements`, () => {
    const entity = generateEntity();
    assert.ok(Array.isArray(entity.offer.features));
    assert.ok(entity.offer.features.length <= 6);
  });

  it(`should have offer description of empty string`, () => {
    const entity = generateEntity();
    assert.strictEqual(entity.offer.description, ``);
  });

  it(`should have offer photos which is array with exact urls`, () => {
    const entity = generateEntity();
    assert.ok(Array.isArray(entity.offer.photos));
    assert.strictEqual(entity.offer.photos.length, 3);
    assert.ok(entity.offer.photos.includes(`http://o0.github.io/assets/images/tokyo/hotel1.jpg`));
    assert.ok(entity.offer.photos.includes(`http://o0.github.io/assets/images/tokyo/hotel2.jpg`));
    assert.ok(entity.offer.photos.includes(`http://o0.github.io/assets/images/tokyo/hotel3.jpg`));
  });

  it(`should have date timestamp not earlier than 1538579688096`, () => {
    const entity = generateEntity();
    assert.strictEqual(typeof entity.date, `number`);
    assert.ok(entity.date > 1538579688096);
  });

});
