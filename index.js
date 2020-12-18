const express = require("express")
const exphbs = require("express-handlebars")
const path = require("path")
const homeRoutes = require("./routes/home")
const cardRoutes = require("./routes/card")
const addRoutes = require("./routes/add")
const coursesRoutes = require("./routes/courses")
const app = express() // создаем экземпляр класса эспресс = сервер
const mongoose = require("mongoose") //  библиотека для подключения и работы с бд

// создаем хендлбарс - движок для рендеринга
const hbs = exphbs.create({
    defaultLayout: "main", // это пакет по умолчанию - первый hbs файл - его надо создать в папке views/layouts
    extname:"hbs" // это для сокращения кода, когда обращаемся с библиотеке
})


// регистрируем движок для рендеринга html страниц
app.engine('hbs', hbs.engine) // просто регистрация движка в экспрессе
app.set('view engine', "hbs") // используем движок в нашем приложении
app.set('views', 'views') // здесь мы указываем папку, где будут хранится html = первый параметр - название настройки, второй - папка

// регистрируем публичную статическую папку, в которой можно хранить общие стили например
app.use(express.static(path.join(__dirname, 'public')))
// добавляем новый функционал для пост запроса который обрабатывает значения
app.use(express.urlencoded({extended:true}))

//прописываем урлы и прокидываем на них html
app.use("/",homeRoutes)
app.use("/add",addRoutes)
app.use("/courses", coursesRoutes)
app.use("/card", cardRoutes)

const PASSWORD = "eHMcaG1t7sI9gmFH"
const url = `mongodb+srv://andrey:${PASSWORD}@cluster0.ovxev.mongodb.net//todos`

// создаем переменную порт = берет служебную переменую свободную или 3000 ?
const PORT = process.env.PORT || 3000

async function start(){
    try {
        await mongoose.connect('mongodb+srv://andrey:eHMcaG1t7sI9gmFH@cluster0.ovxev.mongodb.net/test',{
            useNewUrlParser:true,
            useFindAndModify:false
        })
        app.listen(PORT, ()=>{
            console.log(`server is running on port ${PORT}`)
        })
    }
    catch (e) {
        console.log(e)

    }


}
start()

