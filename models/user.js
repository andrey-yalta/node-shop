const {Schema, model}= require("mongoose")
const userSchema = new Schema({
    email:{
        type:String,
        require: true
    },
    name:{
        type:String,
        require: true
    },
    cart:{
        items:[
            {
                count:{
                type:Number,
                    require:true,
                    default:1
                },
                courseId:{ //здесь короче референция с базой курс
                    type:Schema.Types.ObjectId,
                    ref:"Course",
                    require:true

                }
            }
        ]
    }
})

// при экспорте мы передаем первым параметром название модели, а вторым нашу схему
module.exports = model("User", userSchema)