const express = require('express')
const Controller = require('../controllers/home')
const router = express.Router()

router.get('/', Controller.renderHome) //ada params disini

router.get('/keranjang', Controller.keranjang)
router.get('/logout')

router.get('/profile/:UserId', Controller.renderProfile)
router.get('/profile/:UserId/edit', Controller.renderEdit)
router.post('/profile/:UserId/edit/', Controller.edit)

router.get('/buy/:UserId/:ItemId',Controller.buy)
router.get('/undo/:UserId/:ItemId',Controller.undo)

module.exports = router  