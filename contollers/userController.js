const Kullanici = require('../models/kullanici')
const nodemailer = require('nodemailer')



exports.createUser = async (req,res) => {
    console.log(req.body)


const user = await Kullanici.create(req.body)



}


exports.dogrula = async (req,res) => {

    const user = await Kullanici.findById(req.query.userID)
    user.dogrulandi= 1
    user.save()

    res.redirect('/')

}

exports.cikisyap = async (req,res) => {

 req.session.destroy()

}
    


exports.login = async (req,res) => {
    console.log("login işlemi")
    const user = await Kullanici.findOne({email:req.body.username})
 
    if (user.pass === req.body.pass) {



        req.session.userID = user._id

        console.log(req.session)
        
        
    }
    
    
}