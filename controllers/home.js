const { Item, Profile, User } = require('../models/index')
const { Op } = require("sequelize")
const qrcode = require("qrcode")
const { toCurrency } = require('../helper/index')

class Controller {
    static renderHome(req,res){
        const { filter,sort,search,id } = req.query
        let UserId = id
        let role  
        let options = {
            order:[['id','ASC']],
            include:User
        }
        if(sort==="Murah") options.order=[['price','ASC']]
        if(sort==="Mahal") options.order=[['price','DESC']]
        if(filter==="Makanan") options.where = { CategoryId: {[Op.eq]: 1} }
        if(filter==="Minuman") options.where = { CategoryId: {[Op.eq]: 2} }
        if(search) options.where = { name: {[Op.iLike]: `%${search}%`} }

        let mr
        let admin
        let saldo 
        Profile.findOne({
            where:{
                id:req.session.userId
            }
        })
        .then(profile=>{
            mr = profile
            saldo = toCurrency(profile.saldo)
            return User.findOne({where:{id:req.session.userId}})
        })
        .then((User)=>{
            admin = User
            return Item.findAll(options)
        })
        .then(data=>{
            res.render('home', { mr, data ,admin, id:req.session.userId , role, saldo})
        })
        .catch(err=>{
            res.send(err)
        })
    }

    static renderProfile(req,res){
        const {UserId} = req.params
        const input_text = `http://localhost:3000/home/profile/${UserId}`
        let data
        qrcode.toDataURL(input_text,(err,src)=>{
            if (err) res.send("Something went wrong!!")
            else {
                Profile.findOne({
                    where:{
                        id:req.session.userId
                    }
                })
                .then(findOne=>{
                    data = findOne
                    return Profile.findAll()
                })
                .then((all)=>{
                    res.render('profile',{ all, qr_code: src, data })
                })
                .catch(err=>{
                    res.send(err)
                })
            }
        })
    }

    static renderEdit(req,res){
        const{ UserId } = req.params
        Profile.findByPk(UserId)
        .then(data=>{
            res.render('editForm', { data })
        })
        .catch(err=>{
            res.send(err)
        })
    }

    static edit(req,res){
        // const { UserId } = req.params
        const {name,address,phoneNumber,email,gender,saldo} = req.body
        Profile.update({
            name,
            address,
            phoneNumber,
            email,
            gender,
            saldo
        },{
            where:{
                id:req.session.userId
            }
        })
        .then(()=>{
            res.redirect(`/home/profile/${req.session.userId}`)
        })
        .catch(err=>{
            res.send(err)
        })
    }

    static buy(req,res){
        const { UserId,ItemId } = req.params
        Item.update({
            UserId:req.session.userId
        },{
            where:{
                id:ItemId
            }
        })
        .then(()=>{
            res.redirect(`/home?id=${req.session.userId}`)
        })
        .catch(err=>{
            res.send(err)
        })
    }

    static keranjang(req,res){
        const { checkout } = req.query
        const { UserId }= req.params
        let saldo 
        let oneProfile
        Profile.findOne({
            where:{
                id:req.session.userId
            }
        })
        .then(result=>{
            oneProfile = result
            saldo = result.saldo
            return Item.findAll({
                where:{
                    UserId:req.session.userId
                }
            }) 
        })
        .then(data=>{
            let output
            let totalPrice = Item.totalPrice(data)
            let moneyChanges = saldo - totalPrice
            if(checkout){
                if(moneyChanges>0 && totalPrice>0){
                    Profile.update({saldo:checkout},{where:{id:req.session.userId}})
                    output = `Pembelian Berhasil, Makanan akan diantar ke ${oneProfile.address}`
                    saldo=checkout
                }
                if(moneyChanges<0 && totalPrice>0){
                    output = 'Pembelian Gagal, Uang kurang'
                }
                res.render('keranjang', { data , UserId, saldo, totalPrice,moneyChanges,output })
            }
            if(!checkout){
                res.render('keranjang', { data , UserId, saldo, totalPrice,moneyChanges,output })
            }
        })
        .catch(err=>{
            res.send(err)
        })
    }

    static undo(req,res){
        const { UserId,ItemId } = req.params
        Item.update({
            UserId:null
        },{
            where:{
                id:ItemId
            }
        })
        .then(()=>{
            res.redirect(`/home/keranjang/${req.session.userId}`)
        })
        .catch(err=>{
            res.send(err)
        })
    }

    static delete(req,res){
       const {UserId,ItemId} = req.params
       Item.destroy({
        where:{
            id:ItemId
        }
       })
       .then(()=>{
        res.redirect(`/home?id=${UserId}`)
       })
       .catch(err=>{
        res.send(err)
       })
    }

    static transfer(req,res){
        const {transferTo,nominal} = req.query
        let out
        let intake
        Profile.findOne({where:{id:req.session.userId}})
        .then(data=>{
            out = data.saldo - +nominal
            return Profile.update({saldo:out},{where:{id:req.session.userId}})
        })
        .then(()=>{
            return Profile.findOne({where:{id:transferTo}})
        })
        .then((taken)=>{
            intake = taken.saldo + +nominal
            return Profile.update({saldo:intake},{where:{id:transferTo}})
        })
        .then(()=>{
            res.redirect(`/home/profile/${req.session.userId}`)
        })
        .catch(err=>{
            res.send(err)
        })
    }
}

module.exports = Controller