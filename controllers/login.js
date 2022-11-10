const { User, Profile } = require('../models/index')
const bcrypt = require('bcryptjs')
class UserController {
    static getLogin(req, res) {
        const error = req.query.error
        res.render('login', { error })
    }
    static getRegisterForm(req, res) {
        const errors = req.query.errors
        res.render('registerform', { errors })
    }
    static postRegisterForm(req, res) {
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
        User.create({
            username: username,
            password: password
        })
            .then((dataUser) => {
                return Profile.create({
                    name: name,
                    address: address,
                    phoneNumber: phoneNumber,
                    email: email,
                    gender: gender,
                    saldo: saldo,
                    UserId: dataUser.id
                })
            })
            .then((_) => {
                res.redirect('/login')
            })
            .catch((err) => {
                if (err.name == 'SequelizeValidationError') {
                    let errors = err.errors.map(el => {
                        return el.message
                    })
                    res.redirect(`/login/register?errors=${errors}`)
                } else {
                    res.send(err)
                }
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