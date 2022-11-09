const express = require('express')
const Controller = require('../controllers/home')
const router = express.Router()

router.use('/home', Controller.renderHome)

module.exports = router  