const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/admin-reg',  userController.updateAdminStatusGet);
router.post('/admin-reg', userController.updateAdminStatusPost);

module.exports = router;
