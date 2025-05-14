const Entity = require('../../../shared/core/Entity');

class Appointment extends Entity {
    constructor({ 
        clientId, 
        masterId, 
        serviceId, 
        appointmentDate, 
        duration,
        status = 'not fulfilled',
        note = ''
    }) {
        super();
        this.clientId = clientId;
        this.masterId = masterId;
        this.serviceId = serviceId;
        this.appointmentDate = appointmentDate;
        this.duration = duration;
        this.status = status;
        this.note = note;
    }

    notFulfilled() {
        this.status = 'not fulfilled';
    }

    fulfilled() {
        this.status = 'fulfilled';
    }

    cancel() {
        this.status = 'cancelled';
    }

    updateNote(newNote) {
        this.note = newNote;
    }
}

module.exports = Appointment;