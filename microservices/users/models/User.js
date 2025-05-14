const Entity = require('../../../shared/core/Entity');

class User extends Entity {
    constructor({ firstName, lastName, email, phone, password }) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.password = password;
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    validatePassword(inputPassword) {
        return this.password === inputPassword;
    }
}

module.exports = User;