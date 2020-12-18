const {Router} = require("express")
const Course = require('../models/course')
const router = Router()


router.get("/", (req,res)=>{
    res.render('add',{
        title:"Add | Page",
        isAdd: true,
    })
})

router.post("/", async (req,res)=>{
    const course = new Course(req.body.title, req.body.price, req.body.img)
    await course.save().catch((err) => {console.log(err)})


    res.redirect("/courses")
})



module.exports = router