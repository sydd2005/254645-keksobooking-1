'use strict';

class OffersStore {

  constructor(db) {
    this._db = db;
  }

  get collection() {
    if (!this._collection) {
      this._collection = this._setupCollection();
    }
    return this._collection;
  }

  async _setupCollection() {
    let collection;
    try {
      collection = (await this._db).collection(`offers`);
    } catch (error) {
      console.error(`Не удалось получить доступ к коллекции offers`);
    }
    return collection;
  }

  async getOffers({skip, limit}) {
    const cursor = await (await this.collection).find();
    return {
      data: await cursor.skip(skip).limit(limit).toArray(),
      skip,
      limit,
      total: await cursor.count(),
    };
  }

  async getOffer(date) {
    return (await this.collection).findOne({date});
  }

  async saveOffer(offer) {
    return (await this.collection).insertOne(offer);
  }

}

module.exports = OffersStore;
