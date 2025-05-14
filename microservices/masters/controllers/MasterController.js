const MasterService = require('../services/MasterService');

class MasterController {
    constructor() {
        this.masterService = new MasterService();
    }

    async createMaster(req, res) {
        try {
            const master = await this.masterService.createMaster(req.body);
            res.status(201).json(master);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getMaster(req, res) {
        try {
            const master = await this.masterService.getMasterById(req.params.id);
            if (!master) {
                return res.status(404).json({ error: 'Master not found' });
            }
            res.json(master);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAllMasters(req, res) {
        try {
            const masters = await this.masterService.getAllMasters();
            res.json(masters);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateMaster(req, res) {
        try {
            const updatedMaster = await this.masterService.updateMaster(req.params.id, req.body);
            if (!updatedMaster) {
                return res.status(404).json({ error: 'Master not found' });
            }
            res.json(updatedMaster);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteMaster(req, res) {
        try {
            const result = await this.masterService.deleteMaster(req.params.id);
            if (!result) {
                return res.status(404).json({ error: 'Master not found' });
            }
            res.json({ message: 'Master deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async addService(req, res) {
        try {
            const master = await this.masterService.addServiceToMaster(req.params.masterId, req.params.serviceId);
            res.json(master);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async removeService(req, res) {
        try {
            const master = await this.masterService.removeServiceFromMaster(req.params.masterId, req.params.serviceId);
            res.json(master);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = MasterController;