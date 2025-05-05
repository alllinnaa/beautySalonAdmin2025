const Repository = require('../../../shared/core/Repository');
const ServiceModel = require('../schemas/ServiceSchema');

class ServiceRepository extends Repository {
    constructor() {
        super(ServiceModel);
    }

    async findByName(name) {
        return await this.model.findOne({ name });
    }

}

module.exports = ServiceRepository;