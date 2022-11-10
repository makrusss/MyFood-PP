const express = require('express')
const Controller = require('../controllers/home')
const UserController = require('../controllers/login')
const router = express.Router()

router.get('/', Controller.renderHome) //ada params disini

router.get('/logout', UserController.getLogout)

router.get('/keranjang/:UserId', Controller.keranjang)
router.get('/profile/:UserId', Controller.renderProfile)
router.get('/profile/:UserId/transfer', Controller.transfer)
router.get('/profile/:UserId/edit', Controller.renderEdit)
router.post('/profile/:UserId/edit/', Controller.edit)

router.get('/buy/:UserId/:ItemId',Controller.buy)
router.get('/undo/:UserId/:ItemId',Controller.undo)

router.get('/delete/:UserId/:ItemId', Controller.delete)

module.exports = router  