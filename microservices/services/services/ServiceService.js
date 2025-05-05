const Service = require('../models/Service');
const ServiceRepository = require('../repositories/ServiceRepository');

class ServiceService {
    constructor() {
        this.serviceRepository = new ServiceRepository();
    }

    async createService(serviceData) {
        const existingService = await this.serviceRepository.findByName(serviceData.name);
        if (existingService) {
            throw new Error('Service with this name already exists');
        }

        const service = new Service(serviceData);
        return await this.serviceRepository.create(service);
    }

    async getServiceById(id) {
        return await this.serviceRepository.findById(id);
    }

    async getAllServices() {
        return await this.serviceRepository.find({});
    }

    async updateService(id, updateData) {
        return await this.serviceRepository.update(id, updateData);
    }

    async deleteService(id) {
        return await this.serviceRepository.delete(id);
    }
}

module.exports = ServiceService;