const express = require('express');
const router = express.Router();
const MasterController = require('../controllers/MasterController');
const { validateMasterData } = require('../middlewares/ValidationMasters');
const controller = new MasterController();

router.post('/', validateMasterData, controller.createMaster.bind(controller));
router.get('/', controller.getAllMasters.bind(controller));
router.get('/:id', controller.getMaster.bind(controller));
router.put('/:id',  validateMasterData, controller.updateMaster.bind(controller));
router.delete('/:id', controller.deleteMaster.bind(controller));

router.post('/:masterId/services/:serviceId', controller.addService.bind(controller));
router.delete('/:masterId/services/:serviceId', controller.removeService.bind(controller));

module.exports = router;