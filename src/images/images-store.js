'use strict';

const AVATARS_BUCKET_NAME = `avatars`;
const PREVIEWS_BUCKET_NAME = `previews`;

class ImagesStore {

  constructor(db, bucketFactory) {
    this._db = db;
    this._buckets = [];
    this._bucketFactory = bucketFactory;
  }

  async _getBucket(name) {
    if (!this._buckets[name]) {
      this._buckets[name] = this._setupBucket(name);
    }
    return this._buckets[name];
  }

  async _setupBucket(name) {
    let bucket;
    try {
      bucket = this._bucketFactory.createBucket(await this._db, {
        bucketName: name,
      });
    } catch (error) {
      console.error(`Не удалось получить доступ к хранилищу ${name}`);
    }
    return bucket;
  }

  async _getImage(bucketName, fileName) {
    const bucket = (await this._getBucket(bucketName));
    const files = await bucket.find({fileName}).toArray();
    const fileInfo = files[0];
    if (!fileInfo) {
      return undefined;
    }
    return {
      fileInfo,
      stream: bucket.openDownloadStreamByName(fileName),
    };
  }

  async _saveImage(bucketName, fileName, stream) {
    const bucket = await this._getBucket(bucketName);
    return new Promise((resolve, reject) => {
      stream.pipe(bucket.openUploadStream(fileName))
      .on(`error`, reject)
      .on(`finish`, resolve);
    });
  }

  async getAvatar(fileName) {
    return await this._getImage(AVATARS_BUCKET_NAME, fileName);
  }

  async getPreview(fileName) {
    return await this._getImage(PREVIEWS_BUCKET_NAME, fileName);
  }

  async saveAvatar(fileName, stream) {
    return await this._saveImage(AVATARS_BUCKET_NAME, fileName, stream);
  }

  async savePreview(fileName, stream) {
    return await this._saveImage(PREVIEWS_BUCKET_NAME, fileName, stream);
  }

}

module.exports = ImagesStore;
