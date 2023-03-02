const mongoose = require('mongoose')
const Schema = mongoose.Schema


const kullanicisch = new Schema({

    email: {
        type: String,
    },
    name: {
        type: String,
    },
    pass: {
        type: String,
    },
    dogrulandi: {
        type: Number,
        default:0
    },
    soru: {
        type: Number,
        default:0
    },

})

const Kullanici = mongoose.model('Kullanici', kullanicisch)
module.exports = Kullanici