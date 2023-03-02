const express = require('express')
const userController = require('../contollers/userController')
const router = express.Router()



router.route('/create').post(userController.createUser)
router.route('/login').post(userController.login)
router.route('/auth').get(userController.dogrula)

module.exports= router 