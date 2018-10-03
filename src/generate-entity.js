'use strict';

const TITLES = [
  `Большая уютная квартира`,
  `Маленькая неуютная квартира`,
  `Огромный прекрасный дворец`,
  `Маленький ужасный дворец`,
  `Красивый гостевой домик`,
  `Некрасивый негостеприимный домик`,
  `Уютное бунгало далеко от моря`,
  `Неуютное бунгало по колено в воде`,
];

const OFFER_TYPES = [
  `flat`,
  `palace`,
  `house`,
  `bungalo`,
];

const CHECK_TIMES = [
  `12:00`,
  `13:00`,
  `14:00`,
];

const FEATURES = [
  `wifi`,
  `dishwasher`,
  `parking`,
  `washer`,
  `elevator`,
  `conditioner`,
];

const PHOTO_URLS = [
  `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel3.jpg`,
];

const AVATAR_URL_BASE = `https://robohash.org`;
const ROBOHASH_LENGTH = 5;
const ROBOHASH_RANDOM_BASE = `abcdef`;
const DATE_INTERVAL = 7 * 24 * 60 * 60;
const LOCATION_BOUNDARIES = {
  x: {
    from: 300,
    to: 900,
  },
  y: {
    from: 150,
    to: 500,
  },
};
const PRICE_BOUNDARIES = {
  from: 1000,
  to: 1000000,
};
const ROOM_NUMBER_BOUNDARIES = {
  from: 1,
  to: 5,
};
const GUEST_NUMBER_BOUNDARIES = {
  from: 1,
  to: 12,
};

const generateRandomIntegerInclusive = (lowBound, highBound) => {
  return lowBound + Math.floor(Math.random() * (highBound - lowBound + 1));
};

const takeRandomItem = (sourceArray) => {
  return sourceArray[Math.floor(Math.random() * sourceArray.length)];
};

const takeRandomItems = (sourceArray) => {
  const items = [];
  const randomItemsCount = generateRandomIntegerInclusive(0, sourceArray.length);
  const sourceArrayCopy = sourceArray.slice();
  for (let i = 0; i < randomItemsCount; i++) {
    const randomIndex = generateRandomIntegerInclusive(0, sourceArrayCopy.length - 1);
    items.push(sourceArrayCopy.splice(randomIndex, 1)[0]);
  }
  return items;
};

const shuffleItems = (sourceArray) => {
  const items = [];
  const sourceArrayCopy = sourceArray.slice();
  for (let i = 0; i < sourceArray.length; i++) {
    const randomIndex = generateRandomIntegerInclusive(0, sourceArrayCopy.length - 1);
    items.push(sourceArrayCopy.splice(randomIndex, 1)[0]);
  }
  return items;
};

const generateAvatarUrl = () => {
  let randomHash = ``;
  for (let i = 0; i < ROBOHASH_LENGTH; i++) {
    randomHash += takeRandomItem(ROBOHASH_RANDOM_BASE);
  }
  return `${AVATAR_URL_BASE}/${randomHash}`;
};

const generateEntity = () => {
  const location = {
    x: generateRandomIntegerInclusive(LOCATION_BOUNDARIES.x.from, LOCATION_BOUNDARIES.x.to),
    y: generateRandomIntegerInclusive(LOCATION_BOUNDARIES.y.from, LOCATION_BOUNDARIES.y.to),
  };

  const currentTimestamp = Date.now();
  const earliestTimestamp = currentTimestamp - DATE_INTERVAL;

  const entity = {
    author: {
      avatar: generateAvatarUrl()
    },
    offer: {
      title: takeRandomItem(TITLES),
      address: `${location.x}, ${location.y}`,
      price: generateRandomIntegerInclusive(PRICE_BOUNDARIES.from, PRICE_BOUNDARIES.to),
      type: takeRandomItem(OFFER_TYPES),
      rooms: generateRandomIntegerInclusive(ROOM_NUMBER_BOUNDARIES.from, ROOM_NUMBER_BOUNDARIES.to),
      guests: generateRandomIntegerInclusive(GUEST_NUMBER_BOUNDARIES.from, GUEST_NUMBER_BOUNDARIES.to),
      checkin: takeRandomItem(CHECK_TIMES),
      checkout: takeRandomItem(CHECK_TIMES),
      features: takeRandomItems(FEATURES),
      description: ``,
      photos: shuffleItems(PHOTO_URLS),
    },
    location,
    date: generateRandomIntegerInclusive(earliestTimestamp, currentTimestamp),
  };
  console.log(entity);
  return entity;
};

module.exports = {
  generateEntity
};
