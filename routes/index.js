const express = require('express')
const router = express.Router()
const login = require('./loginRouter')
const homePage = require('./homeRouter')


router.get('/', (req,res)=>{
    res.redirect('/login')
})

router.use('/login', login)
router.use('/home', homePage)

module.exports = router  