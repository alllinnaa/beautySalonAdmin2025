const Repository = require('../../../shared/core/Repository');
const UserModel = require('../schemas/UserSchema');

class UserRepository extends Repository {
    constructor() {
        super(UserModel);
    }

    async findByEmail(email) {
        return await this.model.findOne({ email });
    }
}

module.exports = UserRepository;