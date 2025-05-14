const Repository = require('../../../shared/core/Repository');
const MasterModel = require('../schemas/MasterSchema');

class MasterRepository extends Repository {
    constructor() {
        super(MasterModel);
    }

    async findByEmail(email) {
        return await this.model.findOne({ email });
    }

    async findMastersByService(serviceId) {
        return await this.model.find({ services: serviceId });
    }
}

module.exports = MasterRepository;