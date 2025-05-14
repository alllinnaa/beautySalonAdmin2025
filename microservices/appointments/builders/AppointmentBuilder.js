class AppointmentBuilder {
    constructor() {
        this.appointment = {
            status: 'not fulfilled' 
        };
    }

    withUser(clientId) {
        this.appointment.clientId = clientId;
        return this;
    }

    withMaster(masterId) {
        this.appointment.masterId = masterId;
        return this;
    }

    withService(serviceId) {
        this.appointment.serviceId = serviceId;
        return this;
    }

    forDate(appointmentDate) {
        this.appointment.appointmentDate = appointmentDate;
        return this;
    }

    withDuration(duration) {
        this.appointment.duration = duration;
        this.appointment.appointmentEnd = new Date(
            new Date(this.appointment.appointmentDate).getTime() + duration * 60000
        );
        return this;
    }

    withNote(note) {
        this.appointment.note = note;
        return this;
    }

    build() {
        if (!this.appointment.clientId || !this.appointment.masterId || 
            !this.appointment.serviceId || !this.appointment.appointmentDate) {
            throw new Error('Missing required appointment fields');
        }
        
        return this.appointment;
    }
}

module.exports = AppointmentBuilder;