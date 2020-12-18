const {Router} = require("express")
const Course = require("../models/course")
const router = Router()

router.get("/", async(req,res)=>{
    const courses = await Course.getAll()
    res.render('courses',{
        title:"Courses | Page",
        isCourses: true,
        courses
    })
})

router.get("/:id", async (req, res)=>{
    // здесь мы будем возвращать страницу отдельного курса
    const course = await Course.getBuyId(req.params.id)
    res.render("course",{
        layout:'empty',
        title:`Course | ${course.title}`,
        course
    })
} )

router.get("/:id/edit/", async (req,res)=>{
    // редактирование курса
    if(!req.query.allow){
        //  здесь проверка на query параметр в url строке. это типа ?alloq=true
        return res.redirect("/")
    }
    const course = await Course.getBuyId(req.params.id)
    res.render("course-edit",{
        title:`Edit ${course.title}`,
        course
    })

})

router.post("/edit", async (req,res)=>{
    await Course.update(req.body)
    res.redirect("/courses")
})


module.exports = router