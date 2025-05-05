const Entity = require('../../../shared/core/Entity');

class Service extends Entity {
    constructor({ name, description, price, duration }) {
        super();
        this.name = name;
        this.description = description;
        this.price = price;
        this.duration = duration;
    }
}

module.exports = Service;