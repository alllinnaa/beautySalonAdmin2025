const AppointmentBuilder = require('../builders/AppointmentBuilder');

class ScheduleFacade {
    constructor(appointmentService, masterService, userService, serviceService) {
        this.appointmentService = appointmentService;
        this.masterService = masterService;
        this.userService = userService;
        this.serviceService = serviceService;
    }

    async createAppointment(bookingData) {
        try {
            const [user, master, service] = await Promise.all([
                this.userService.getUserById(bookingData.clientId),
                this.masterService.getMasterById(bookingData.masterId),
                this.serviceService.getServiceById(bookingData.serviceId)
            ]);
    
            if (!user) throw new Error('User not found');
            if (!master) throw new Error('Master not found');
            if (!service) throw new Error('Service not found');
    
            if (!master.services.includes(bookingData.serviceId)) {
                throw new Error('This master does not provide the selected service');
            }
    
            const appointment = new AppointmentBuilder()
                .withUser(bookingData.clientId)
                .withMaster(bookingData.masterId)
                .withService(bookingData.serviceId)
                .forDate(bookingData.appointmentDate)
                .withDuration(service.duration)
                .withNote(bookingData.note || '')
                .build();
    
            const conflictingAppointments = await this.appointmentService.checkAvailability(
                bookingData.masterId,
                appointment.appointmentDate,
                appointment.appointmentEnd
            );
    
            if (conflictingAppointments.length > 0) {
                throw new Error('Time slot is already booked');
            }
    
            return this.appointmentService.createAppointment(appointment);
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw new Error(`Failed to create appointment: ${error.message}`);
        }
    }

    async updateAppointment(appointmentId, updateData) {
        const existingAppointment = await this.appointmentService.getAppointmentById(appointmentId);
        if (!existingAppointment) {
            throw new Error('Appointment not found');
        }
    
        const masterId = updateData.masterId || existingAppointment.masterId;
        const appointmentDate = updateData.appointmentDate 
            ? new Date(updateData.appointmentDate)
            : new Date(existingAppointment.appointmentDate);
        const duration = updateData.duration || existingAppointment.duration;
    
        const appointmentEnd = new Date(appointmentDate);
        appointmentEnd.setMinutes(appointmentEnd.getMinutes() + duration);
    
        const conflicts = await this.appointmentService.checkAvailability(
            masterId,
            appointmentDate,
            appointmentEnd
        );
    
        const realConflicts = conflicts.filter(conflict => conflict._id.toString() !== appointmentId);
        if (realConflicts.length > 0) {
            throw new Error('Time slot is already booked');
        }
    
        return this.appointmentService.updateAppointment(appointmentId, updateData);
    }
    

    async getMasterSchedule(masterId, startDate, endDate) {
        const master = await this.masterService.getMasterById(masterId);
        if (!master) throw new Error('Master not found');
        
        return this.appointmentService.getMasterAppointments(masterId, startDate, endDate);
    }

    async cancelAppointment(appointmentId) {
        return this.appointmentService.cancelAppointment(appointmentId);
    }

    async isTimeSlotAvailable(masterId, startTime, endTime) {
        const conflicts = await this.appointmentService.checkAvailability(
            masterId, 
            startTime, 
            endTime
        );
        return conflicts.length === 0;
}
}

module.exports = ScheduleFacade;