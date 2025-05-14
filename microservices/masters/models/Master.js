const Entity = require('../../../shared/core/Entity');

class Master extends Entity {
    constructor({ firstName, lastName, email, phone, services = [] }) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.services = services;
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    addService(serviceId) {
        if (!this.services.includes(serviceId)) {
            this.services.push(serviceId);
        }
    }

    removeService(serviceId) {
        this.services = this.services.filter(id => id.toString() !== serviceId.toString());
    }
}

module.exports = Master;