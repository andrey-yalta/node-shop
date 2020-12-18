const express = require("express")
const exphbs = require("express-handlebars")
const path = require("path")
const homeRoutes = require("./routes/home")
const cardRoutes = require("./routes/card")
const addRoutes = require("./routes/add")
const coursesRoutes = require("./routes/courses")
const app = express() // создаем экземпляр класса эспресс = сервер
const mongoose = require("mongoose") //  библиотека для подключения и работы с бд
const User = require("./models/user")

// решение вопроса
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

// создаем хендлбарс - движок для рендеринга
const hbs = exphbs.create({
    defaultLayout: "main", // это пакет по умолчанию - первый hbs файл - его надо создать в папке views/layouts
    extname:"hbs", // это для сокращения кода, когда обращаемся с библиотеке
    handlebars: allowInsecurePrototypeAccess(Handlebars) /// хуйня чтобы решить проблему с ошибкой доступа

})


// регистрируем движок для рендеринга html страниц
app.engine('hbs', hbs.engine) // просто регистрация движка в экспрессе
app.set('view engine', "hbs") // используем движок в нашем приложении
app.set('views', 'views') // здесь мы указываем папку, где будут хранится html = первый параметр - название настройки, второй - папка

app.use(async(req,res,next)=>{
    try{
        req.user = await User.findById("5fdce0c33195143d24509b8f")
        next()
    }
    catch (e) {
        console.log(e)
    }

})


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
        await mongoose.connect('mongodb+srv://andrey:eHMcaG1t7sI9gmFH@cluster0.ovxev.mongodb.net/shop',{
            useNewUrlParser:true,
            useFindAndModify:false,
            useUnifiedTopology: true,
        })
        const candidate = await User.findOne() // проверяем есть ли что нибудь в бд User
        if(!candidate){ // если нет. то создаем нового пользователя
            const user = new User({
                email: "andrey@mail.ry",
                name: "andrey",
                cart:{items:[]}
            })
            await  user.save() // сохраняем данные
        }

        app.listen(PORT, ()=>{
            console.log(`server is running on port ${PORT}`)
        })
    }
    catch (e) {
        console.log(e)

    }


}
start()

