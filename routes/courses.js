const {Router} = require("express")
const Course = require("../models/course")
const auth = require("../middleware/auth")
const router = Router()

function isOwner(course, req){
    // функция для проверки id пользователя, который хочет открыть данную страницу  и id пользователя - создателя курса
    return course.userId.toString() === req.user._id.toString()
}


router.get("/", async(req,res)=>{
    try {
        const courses = await Course.find()

        res.render('courses',{
            title:"Courses | Page",
            isCourses: true,
            userId:req.user ? req.user._id.toString() : null ,
            courses
        })
    }catch (e) {
        console.log(e)
    }
  
})


router.get("/:id", async (req, res)=>{
     try {
         // здесь мы будем возвращать страницу отдельного курса
         const course = await Course.findById(req.params.id)
         // метод findById - это метод mongoose
         res.render("course",{
             layout:'empty',
             title:`Course | ${course.title}`,
             course
         })
     }catch (e) {
         console.log(e)
     }

} )

router.get("/:id/edit/",auth, async (req,res)=>{
    // редактирование курса
    if(!req.query.allow){
        //  здесь проверка на query параметр в url строке. это типа ?alloq=true
        return res.redirect("/")
    }
    try{
        const course = await Course.findById(req.params.id)

        // проверка на то является ли человек, который открывает редактирование курса - создателем
        if(!isOwner(course, req)){
            return res.redirect("/courses")
        }
        res.render("course-edit",{
            title:`Edit ${course.title}`,
            course
        })
    }catch (e) {
        console.log(e)
    }


})

router.post("/edit",auth, async (req,res)=>{
    try {
        const {id} = req.body // получаем id
        delete  req.body.id  // удаляем его из тела
        const course = await Course.findById(id) // здесь получаем наш курс чтобы провести проверку на хозяина курса
        if(!isOwner(course,req)){
            return res.redirect("/courses")// если не прошли = возвращает на страницу курсов
        }


        // здесь мы из тела удалили обычный id, т к монгус сам назачит id, но поиск мы всё равно осуществляем по старому
        // await Course.findByIdAndUpdate(id, req.body)
        Object.assign(course, req.body) // этот метод делает копирование из одного обьекта в другой
        await course.save()
        res.redirect("/courses")
    }catch (e) {
        console.log(e)
    }

})

router.post("/remove",auth, async (req,res)=>{
    try{
        await Course.deleteOne({
            _id: req.body.id, // поверка совпадает ли id курсов
            userId: req.user._id // проверка - совпадает ли id хозяина курса и курса
        })
        res.redirect("/courses")
    }
    catch (e) { console.log(e)}

})

module.exports = router