const ScheduleFacade = require('../facades/ScheduleFacade');
const AppointmentService = require('../services/AppointmentService');
const MasterService = require('../../masters/services/MasterService');  
const UserService = require('../../users/services/UserService');  
const ServiceService = require('../../services/services/ServiceService'); 

class AppointmentController {
    constructor() {
        this.appointmentService = new AppointmentService();
        this.masterService = new MasterService();
        this.userService = new UserService();
        this.serviceService = new ServiceService();
        this.scheduleFacade = new ScheduleFacade(
            this.appointmentService, 
            this.masterService, 
            this.userService,
            this.serviceService
        );
    }

    async createAppointment(req, res) {
        try {
            const appointment = await this.scheduleFacade.createAppointment(req.body);
            res.status(201).json(appointment);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAppointment(req, res) {
        try {
            const appointment = await this.appointmentService.getAppointmentById(req.params.id);
            if (!appointment) {
                return res.status(404).json({ error: 'Appointment not found' });
            }
            res.json(appointment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getMasterAppointments(req, res) {
        try {
            const { masterId } = req.params;
            const { startDate, endDate } = req.query;
            
            if (!this.appointmentService.getMasterAppointments) {
                return res.status(500).json({ error: 'Method getMasterAppointments is undefined' });
            }

            const appointments = await this.appointmentService.getMasterAppointments(
                masterId, 
                new Date(startDate), 
                new Date(endDate)
            );
            
            res.json(appointments);
        } catch (error) {
            console.error(error); 
            res.status(500).json({ error: error.message });
        }
    }
     

    async getClientAppointments(req, res) {
        try {
            const appointments = await this.appointmentService.getClientAppointments(req.params.clientId);
            res.json(appointments);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async updateAppointment(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;
    
            const updatedAppointment = await this.scheduleFacade.updateAppointment(id, updateData);
            res.json(updatedAppointment);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    
    async cancelAppointment(req, res) {
        try {
            const cancelledAppointment = await this.appointmentService.cancelAppointment(req.params.id);
            res.json(cancelledAppointment);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteAppointment(req, res) {
        try {
            const result = await this.appointmentService.deleteAppointment(req.params.id);
            res.json({ message: 'Appointment deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    async getMasterSchedule(req, res) {
        try {
            const { masterId } = req.params;
            const { startDate, endDate } = req.query;
            
            const schedule = await this.scheduleFacade.getMasterSchedule(
                masterId,
                new Date(startDate),
                new Date(endDate)
            );
            
            res.json(schedule);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = AppointmentController;