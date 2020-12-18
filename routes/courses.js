const {Router} = require("express")
const Course = require("../models/course")
const router = Router()

router.get("/", async(req,res)=>{
    const courses = await Course.find()
    // const courses = await Course.find().populate('userId').select('email name') // populaate -короче меняет список на обьекты, с ключами по заданному параметру
    // select - поля, которые мы хотим отобразить
    // метод find - это метод mongoose


    res.render('courses',{
        title:"Courses | Page",
        isCourses: true,
        courses
    })
})


router.get("/:id", async (req, res)=>{
    // здесь мы будем возвращать страницу отдельного курса
    const course = await Course.findById(req.params.id)
    // метод findById - это метод mongoose
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
    const course = await Course.findById(req.params.id)
    res.render("course-edit",{
        title:`Edit ${course.title}`,
        course
    })

})

router.post("/edit", async (req,res)=>{
    const {id} = req.body
    delete  req.body.id
    // здесь мы из тела удалили обычный id, т к монгус сам назачит id, но поиск мы всё равно осуществляем по старому
    await Course.findByIdAndUpdate(id, req.body)
    res.redirect("/courses")
})

router.post("/remove", async (req,res)=>{
    try{
        await Course.deleteOne({_id: req.body.id})
        res.redirect("/courses")
    }
    catch (e) { console.log(e)}

})

module.exports = router