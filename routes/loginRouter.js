const express = require('express')
const Controller = require('../controllers/login')
const router = express.Router()

router.use('/home', Controller.renderLogin)

module.exports = router  