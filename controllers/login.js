const { User, Profile } = require('../models/index')
const bcrypt = require('bcryptjs')
class UserController {
    static getLogin(req, res) {
        const error = req.query.error
        res.render('login', { error })
    }
    static getRegisterForm(req, res) {
        res.render('registerform')
    }
    static postRegisterForm(req, res) {
        // console.log(req.body);
        const {
            username,
            password,
            name,
            address,
            phoneNumber,
            email,
            gender,
            saldo
        } = req.body
        let userId
        User.create({
            username: username,
            password: password
        })
            .then((dataUser) => {
                userId = User.id
                Profile.create({
                    name: name,
                    address: address,
                    phoneNumber: phoneNumber,
                    email: email,
                    gender: gender,
                    saldo: saldo,
                    UserId: dataUser.id
                })
                res.redirect('/login')
            })
            .catch((err) => {
                res.send(err)
            });
    }
    static postLogin(req, res) {
        const { username, password } = req.body
        User.findOne({
            where: {
                username: username
            }
        })
            .then((dataUser) => {
                if (dataUser) {
                    const isValidPassword = bcrypt.compareSync(password, dataUser.password)
                    console.log(isValidPassword);
                    if (isValidPassword) {
                        req.session.userId = dataUser.id
                        res.redirect(`/home?id=${dataUser.id}`)
                    } else {
                        const error = "Invalid Username / Password"
                        res.redirect(`/login?error=${error}`)
                    }
                } 
                else {
                    const error = "Username / Password not registered yet"
                    return res.redirect(`/login?error=${error}`)
                }
            })
            .catch((err) => {
                res.send(err)
            });
    }

    static getLogout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                res.send(err)
            } else {
                res.redirect('/login')
            }
        })
    }
}

module.exports = UserController