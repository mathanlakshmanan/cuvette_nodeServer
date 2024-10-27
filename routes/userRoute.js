const express = require('express');
const router = express.Router()
const userController = require('../controller/userController');
const {verifySignup} = require('../middlewares');

router.post('/register',[verifySignup.checkDuplicateUserEmail], userController.registerController);
router.put('/mobile_verify/:id', userController.mobileVerifyController);
router.put('/email_verify/:id',userController.emailVerifyController);
router.post('/login',userController.loginController);


module.exports = router;