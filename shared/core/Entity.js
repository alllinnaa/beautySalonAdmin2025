const { v4: uuidv4 } = require('uuid');

class Entity {
    constructor() {
        this.id = uuidv4();
        this.createdAt = new Date();
    }
}

module.exports = Entity;
