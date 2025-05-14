const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');

const controller = new AppointmentController();

router.post('/', controller.createAppointment.bind(controller));
router.get('/:id', controller.getAppointment.bind(controller));
router.get('/master/:masterId', controller.getMasterAppointments.bind(controller));
router.get('/client/:clientId', controller.getClientAppointments.bind(controller));
router.put('/:id', controller.updateAppointment.bind(controller));
router.put('/:id/cancel', controller.cancelAppointment.bind(controller));
router.delete('/:id', controller.deleteAppointment.bind(controller));

module.exports = router;