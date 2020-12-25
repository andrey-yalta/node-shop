if(process.env.NODE_ENV === "production"){ // здесь мы проверяем в каком моде мы находимся - env.NODE_ENV - это системная переменная на серверах
     module.exports = require("./keys.prod") // если в продакшене то продакш
}
else {
     module.exports =require("./keys.dev") // если разработка - то разработка
}
