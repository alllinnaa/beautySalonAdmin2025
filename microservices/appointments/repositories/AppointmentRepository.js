const Repository = require('../../../shared/core/Repository');
const AppointmentModel = require('../schemas/AppointmentSchema');

class AppointmentRepository extends Repository {
    constructor() {
        super(AppointmentModel);
    }

    async findByMaster(masterId, startDate, endDate, skip = 0, limit = 10) {
        if (!masterId) {
            throw new Error('Master ID is required');
        }
    
        if (isNaN(startDate) || isNaN(endDate)) {
            throw new Error('Invalid date range');
        }
    
        return await this.model.find({
            masterId,
            appointmentDate: { $gte: startDate, $lte: endDate }
        })
        .sort({ appointmentDate: 1 })
        .skip(skip)  
        .limit(limit);  
    }
    
    
    async findByClient(clientId) {
        return await this.model.find({ clientId }).sort({ appointmentDate: -1 });
    }

    async findConflictingAppointments(masterId, startTime, endTime) {
        return await this.model.find({
            masterId,
            $or: [
                { 
                    appointmentDate: { $lt: endTime },
                    appointmentEnd: { $gt: startTime }
                }
            ]
        }, { _id: 1 }); 
    }
}

module.exports = AppointmentRepository;