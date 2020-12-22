const express = require("express")
const exphbs = require("express-handlebars")
const path = require("path")
const homeRoutes = require("./routes/home")
const cardRoutes = require("./routes/card")
const addRoutes = require("./routes/add")
const coursesRoutes = require("./routes/courses")
const ordersRoutes = require("./routes/orders")
const authRoutes = require("./routes/auth")
const app = express() // создаем экземпляр класса эспресс = сервер
const mongoose = require("mongoose") //  библиотека для подключения и работы с бд
const User = require("./models/user")
const session = require("express-session") // импорт библиотеки для создания сессии
const MongoStore = require("connect-mongodb-session")(session) // это пакет чтобы сохранять сессию в бд. важно подключать его уже после поднлючения session
const varMiddleware = require("./middleware/variables")
const userMiddleware = require("./middleware/user")
const csrf = require("csurf") // пакет для безопасности от кросс-платформенных уязвимостей

// uri для подключения к бд
const PASSWORD = "eHMcaG1t7sI9gmFH"
const MONGODB_URI = 'mongodb+srv://andrey:eHMcaG1t7sI9gmFH@cluster0.ovxev.mongodb.net/shop'


// решение вопроса
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

// создаем хендлбарс - движок для рендеринга
const hbs = exphbs.create({
    defaultLayout: "main", // это пакет по умолчанию - первый hbs файл - его надо создать в папке views/layouts
    extname:"hbs", // это для сокращения кода, когда обращаемся с библиотеке
    handlebars: allowInsecurePrototypeAccess(Handlebars) /// хуйня чтобы решить проблему с ошибкой доступа

})


const store = new MongoStore({
    // прикольная штука, если мы подключаем сессию после авторизации с помощью библиотеки session то мы сохраняем
    // в базу данныз в ветку session данные об входе
    // если мы выходим - данные удаляются из базы данных
    collection: "sessions",
    uri:MONGODB_URI
})


// регистрируем движок для рендеринга html страниц
app.engine('hbs', hbs.engine) // просто регистрация движка в экспрессе
app.set('view engine', "hbs") // используем движок в нашем приложении
app.set('views', 'views') // здесь мы указываем папку, где будут хранится html = первый параметр - название настройки, второй - папка



// регистрируем публичную статическую папку, в которой можно хранить общие стили например
app.use(express.static(path.join(__dirname, 'public')))
// добавляем новый функционал для пост запроса который обрабатывает значения
app.use(express.urlencoded({extended:true}))
//настройка сессии
app.use(session({
    secret: "some secret value",
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(csrf()) // сразу после вызова сессии мы подключаем наш csurf для защиты от уязвимостей кросс-платформенных
app.use(varMiddleware) // добавляем функцию мидлвеер - в данный момент это isauth
app.use(userMiddleware) // здесь мы добавили функцию чтобы ипользовать метод AddToCard урок 055

//прописываем урлы и прокидываем на них html
app.use("/",homeRoutes)
app.use("/add",addRoutes)
app.use("/courses", coursesRoutes)
app.use("/card", cardRoutes)
app.use("/orders", ordersRoutes)
app.use("/auth", authRoutes)


// создаем переменную порт = берет служебную переменую свободную или 3000 ?
const PORT = process.env.PORT || 3000

async function start(){
    try {
        await mongoose.connect(MONGODB_URI,{
            useNewUrlParser:true,
            useFindAndModify:false,
            useUnifiedTopology: true,
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

