const Master = require('../models/Master');
const MasterRepository = require('../repositories/MasterRepository');

class MasterService {
    constructor() {
        console.log("Repositooooorrryyyyy");
        this.masterRepository = new MasterRepository();
    }

    async createMaster(masterData) {
        const existingMaster = await this.masterRepository.findByEmail(masterData.email);
        if (existingMaster) {
            throw new Error('Master with this email already exists');
        }

        const master = new Master(masterData);
        return await this.masterRepository.create(master);
    }

    async getMasterById(id) {
        return await this.masterRepository.findById(id);
    }

    async getAllMasters() {
        return await this.masterRepository.find({});
    }

    async updateMaster(id, updateData) {
        return await this.masterRepository.update(id, updateData);
    }

    async deleteMaster(id) {
        return await this.masterRepository.delete(id);
    }

    async addServiceToMaster(masterId, serviceId) {
        const master = await this.masterRepository.findById(masterId);
        if (!master) throw new Error('Master not found');
        
        master.addService(serviceId);
        return await this.masterRepository.update(masterId, master);
    }

    async removeServiceFromMaster(masterId, serviceId) {
        const master = await this.masterRepository.findById(masterId);
        if (!master) throw new Error('Master not found');
        
        master.removeService(serviceId);
        return await this.masterRepository.update(masterId, master);
    }
}

module.exports = MasterService;