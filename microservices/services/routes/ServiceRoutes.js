const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/ServiceController');
const controller = new ServiceController();

router.post('/', controller.createService.bind(controller));
router.get('/', controller.getAllServices.bind(controller));
router.get('/:id', controller.getService.bind(controller));
router.put('/:id', controller.updateService.bind(controller));
router.delete('/:id', controller.deleteService.bind(controller));

module.exports = router;