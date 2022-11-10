const express = require('express')
const UserController = require('../controllers/login')
const router = express.Router()

router.get('/', UserController.getLogin)

router.post('/', UserController.postLogin)

router.get('/register', UserController.getRegisterForm)

router.post('/register', UserController.postRegisterForm)


// Jika udah logout harusnya gabisa masuk ke home lagix




module.exports = router  