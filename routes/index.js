const express = require('express')
const router = express.Router()
const login = require('./loginRouter')
const homePage = require('./homeRouter')


router.get('/', (req,res)=>{
    res.redirect('/login')
})

router.use('/login', login)

router.use(function(req, res, next){
    console.log(req.session);
    if(!req.session.userId){
        const error = "Please Login First!"
        res.redirect(`/login?error=${error}`)
    } else {
        next()
    }

})

router.use('/home', homePage)

module.exports = router  