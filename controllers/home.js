const { Item, Profile, User } = require('../models/index')
const { Op } = require("sequelize");

class Controller {
    static renderHome(req,res){
        const { sort,search } = req.query
        let UserId = 1 //dummy ID
        let role  
        let options = {
            order:[['id','ASC']],
            include:User
        }
        if(sort==="Murah") options.order=[['price','ASC']]
        if(sort==="Mahal") options.order=[['price','DESC']]
        if(search) options.where = { name: {[Op.iLike]: `%${search}%`} }

        let saldo 
        Profile.findOne({
            where:{
                id:UserId
            }
        })
        .then(profile=>{
            saldo = profile.saldo
            console.log(saldo,`<<<<<<<<`)
        })
        .catch(err=>{
            res.send(err)
        })
        Item.findAll(options)
        .then(data=>{
            res.render('home', { data , id:UserId , role,saldo})
        })
        .catch(err=>{
            res.send(err)
        })
    }

    static renderProfile(req,res){
        const { UserId } = req.params
        Profile.findOne({
            where:{
                id:UserId
            }
        })
        .then(data=>{
            res.render('profile',{ data })
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
        const { UserId } = req.params
        const {name,address,phoneNumber,email,gender} = req.body
        // console.log(UserId,`<<<<<<<`)
        Profile.update({
            name,
            address,
            phoneNumber,
            email,
            gender
        },{
            where:{
                id:UserId
            }
        })
        .then(()=>{
            res.redirect(`/home/profile/${UserId}`)
        })
        .catch(err=>{
            res.send(err)
        })
    }

    static buy(req,res){
        const { UserId,ItemId } = req.params
        Item.update({
            UserId:UserId
        },{
            where:{
                id:ItemId
            }
        })
        .then(()=>{
            res.redirect('/home')
        })
        .catch(err=>{
            res.send(err)
        })
    }

    static keranjang(req,res){
        let UserId = 1 //dummy ID
        Item.findAll({
            where:{
                UserId:UserId
            }
        })
        .then(data=>{
            console.log(data)
            res.render('keranjang', { data , id:UserId})
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
            res.redirect('/home/keranjang')
        })
        .catch(err=>{
            res.send(err)
        })
    }
}

module.exports = Controller