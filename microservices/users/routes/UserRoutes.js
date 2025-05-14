const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const controller = new UserController();

router.post('/', controller.createUser.bind(controller));
router.get('/', controller.getAllUsers.bind(controller));
router.get('/:id', controller.getUserById.bind(controller));
router.put('/:id', controller.updateUser.bind(controller));
router.delete('/:id', controller.deleteUser.bind(controller));

module.exports = router;