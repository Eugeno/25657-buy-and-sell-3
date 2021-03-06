const { nanoid } = require(`nanoid`);
const { MAX_ID_LENGTH } = require(`../constants`);

class OffersService {
  constructor(offers) {
    this._offers = offers;
  }

  create(offer) {
    const newOffer = {
      id: nanoid(MAX_ID_LENGTH),
      comments: [],
      ...offer,
    };

    this._offers.push(newOffer);
    return newOffer;
  }

  drop(id) {
    const offer = this._offers.find((item) => item.id === id);

    if (!offer) {
      return null;
    }

    this._offers = this._offers.filter((item) => item.id !== id);
    return offer;
  }

  findAll() {
    return this._offers;
  }

  findOne(id) {
    console.log(this._offers);
    return this._offers.find((item) => item.id === id);
  }

  update(id, offer) {
    const oldOffer = this._offers.find((item) => item.id === id);

    return {
      ...oldOffer,
      ...offer,
    };
  }
}

module.exports = OffersService;
