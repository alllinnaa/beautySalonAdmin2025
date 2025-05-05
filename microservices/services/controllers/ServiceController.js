const ServiceService = require('../services/ServiceService');

class ServiceController {
    constructor() {
        this.serviceService = new ServiceService();
    }

    async createService(req, res) {
        try {
            const service = await this.serviceService.createService(req.body);
            res.status(201).json(service);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getService(req, res) {
        try {
            const service = await this.serviceService.getServiceById(req.params.id);
            if (!service) {
                return res.status(404).json({ error: 'Service not found' });
            }
            res.json(service);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllServices(req, res) {
        try {
            const services = await this.serviceService.getAllServices();
            res.json(services);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateService(req, res) {
        try {
            const updatedService = await this.serviceService.updateService(req.params.id, req.body);
            if (!updatedService) {
                return res.status(404).json({ error: 'Service not found' });
            }
            res.json(updatedService);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteService(req, res) {
        try {
            const result = await this.serviceService.deleteService(req.params.id);
            if (!result) {
                return res.status(404).json({ error: 'Service not found' });
            }
            res.json({ message: 'Service deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ServiceController;