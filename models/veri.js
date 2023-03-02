const mongoose = require('mongoose')
const Schema = mongoose.Schema


const kullanicisch = new Schema({

    yas: {
        type: Number,
    },
    fiyat: {
        type: Number,
    },
    kalite: {
        type: Number,
    },
    rahatlik: {
        type: Number,
    },
    şiklik: {
        type: Number,
    },

})

const Kullanici = mongoose.model('Kullanici', kullanicisch)
module.exports = Kullanici