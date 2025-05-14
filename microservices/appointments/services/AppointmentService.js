const Appointment = require('../models/Appointment');
const AppointmentRepository = require('../repositories/AppointmentRepository');

class AppointmentService {
    constructor() {
        this.repository = new AppointmentRepository();
    }

    async createAppointment(appointmentData) {
        const { masterId, appointmentDate, duration } = appointmentData;
        const appointmentEnd = new Date(appointmentDate);
        appointmentEnd.setMinutes(appointmentEnd.getMinutes() + duration);
        const conflictingAppointments = await this.checkAvailability(
            masterId, 
            new Date(appointmentDate), 
            appointmentEnd
        );
    
        if (conflictingAppointments.length > 0) {
            throw new Error('Time slot is already taken.');
        }
    
        const appointment = new Appointment(appointmentData);
        return this.repository.create(appointment);
    }
    

    async getAppointmentById(id) {
        return await this.repository.findById(id);
    }

    async getMasterAppointments(masterId, startDate, endDate) {
        return await this.repository.findByMaster(masterId, startDate, endDate);
    }

    async getClientAppointments(clientId) {
        return await this.repository.findByClient(clientId);
    }

    async updateAppointment(id, updateData) {
        let appointment = await this.repository.findById(id);
        if (!appointment) throw new Error('Appointment not found');

        if (!(appointment instanceof Appointment)) {
            appointment = new Appointment(appointment);
        }


        if (updateData.clientId !== undefined) appointment.clientId = updateData.clientId;
        if (updateData.masterId !== undefined) appointment.masterId = updateData.masterId;
        if (updateData.serviceId !== undefined) appointment.serviceId = updateData.serviceId;
        if (updateData.appointmentDate !== undefined) {
            appointment.appointmentDate = new Date(updateData.appointmentDate);
        }
        if (updateData.duration !== undefined) appointment.duration = updateData.duration;
        if (updateData.note !== undefined) appointment.note = updateData.note;

        if (updateData.status !== undefined) {
            this.updateAppointmentStatus(appointment, updateData.status);
        }

        if (updateData.appointmentDate !== undefined || updateData.duration !== undefined) {
            const endTime = new Date(appointment.appointmentDate);
            endTime.setMinutes(endTime.getMinutes() + appointment.duration);
            appointment.appointmentEnd = endTime;
        }

        return await this.repository.update(id, appointment);
    }

    async cancelAppointment(id) {
        const appointment = await this.repository.findById(id);
        if (!appointment) throw new Error('Appointment not found');

        appointment.cancel();
        const updatedAppointment = await this.repository.update(id, appointment);
        
        
        return updatedAppointment;
    }

    async deleteAppointment(id) {
        const result = await this.repository.delete(id);
        if (!result) throw new Error('Appointment not found');
        return result;
    }

    async checkAvailability(masterId, startTime, endTime) {
        return this.repository.findConflictingAppointments(masterId, startTime, endTime);
    }


    updateAppointmentStatus(appointment, status) {
        switch (status) {
            case 'not fulfilled':
                appointment.notFulfilled();
                break;
            case 'fulfilled':
                appointment.fulfilled();
                break;
            case 'cancelled':
                appointment.cancel();
                break;
            default:
                throw new Error('Invalid status');
        }
    }

}

module.exports = AppointmentService;