const {Router} = require("express")
// const Card = require("../models/card")
const Course = require("../models/course")
const auth = require("../middleware/auth")
const router = Router()


function mapCartItems(cart){
    return cart.items.map(c=>({
        ...c.courseId._doc,
        id:c.courseId.id,
        count:c.count
    }))
}

function computePrice(courses){
    return courses.reduce((total,course)=>{
        return total += course.price *course.count
    }, 0)
}

router.post("/add", auth, async (req,res)=>{
    const course = await Course.findById(req.body.id)
    await req.user.addToCart(course)
    res.redirect("/card")
})

router.delete('/remove/:id',auth, async (req,res)=>{
    // парамс в значнии ниже, означает что мы берем значенме из адрессной строки

    await req.user.removeFromCart(req.params.id)
    const user = await req.user.populate('cart.items.courseId').execPopulate()
    const courses = mapCartItems(user.cart)
    const cart = {
        courses, price: computePrice(courses)
    }
    res.json(cart)
})

router.get("/",auth, async (req,res)=>{
    const user = await req.user
        .populate("cart.items.courseId")
        .execPopulate()
    // console.log(user.cart.items)
    const courses = mapCartItems(user.cart)

    // const card = await Card.fetch()
    res.render("card",{
        title: "Card",
        isCard:true,
        courses: courses,
        price: computePrice(courses)
    })

})




module.exports = router