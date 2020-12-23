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
    password:{
        type:String,
        require: true
    },
    resetToken:String,
    resetTokenExp:Date,
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


userSchema.methods.addToCart = function(course){
    const items = [...this.cart.items]
    // здесь мы определяем индекс, если он есть, то курс уже существует в корзине и мы должны добавить количество
    // если курса нет в корзине, то создать первый
    const index = items.findIndex(c=> {
        return c.courseId.toString() === course._id.toString() // сравнение id
    })
    if(index >=0){
        items[index].count  = items[index].count+1
    }
    else {
        items.push({
            courseId: course._id,
            count: 1
        })
    }
    this.cart = {items}
    return this.save()
}

userSchema.methods.removeFromCart = function(id){
    let items = [...this.cart.items]
    const idx = items.findIndex(c=>  c.courseId.toString() === id.toString())
    if(items[idx].count === 1){
         items = items.filter(c => c.courseId.toString() !== id.toString()) // удаляем элемент в корзие
    }
    else {
        items[idx].count --
    }
    this.cart = {items}
    return this.save()

}

userSchema.method('toClient', function () {
const course = this.toObject()
    course.id = course._id
    delete course._id
    return course
})


userSchema.methods.clearCart = function(){
    this.cart = {items:[]}
    return this.save()

}
// при экспорте мы передаем первым параметром название модели, а вторым нашу схему
module.exports = model("User", userSchema)