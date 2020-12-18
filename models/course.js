const {Schema, model}= require("mongoose")
const course = new Schema({
    title: {
        type: String,
        require: true
        },
    price: {
        type: Number,
        require: true
        },
    img:{
        type:String,
    },
    userId:{
        type:Schema.Types.ObjectId,
         ref:"User" // данная строка должна ПОЛНОСТЬЮ сопадать с НАЗВАНИЕМ МОДЕЛИ
    }

})



// при экспорте мы передаем первым параметром название модели, а вторым нашу схему
module.exports = model("Course", course)