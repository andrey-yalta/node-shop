const {body} = require("express-validator/check")

exports.registerValidators = [
    body('email').isEmail().withMessage('Input correct email'), // сообщения об ошибки можно добавлят либо так withMessage , либо как внизу вторым параметром
    body("password", "password should be  6th sumbols min").isLength({min:6, max:56}).isAlphanumeric(),
    body("confirm").custom((value, {req})=>{ //  пример добавления кастомной проверки
        if(value !== req.body.password){
            throw new Error("passwords should be equal")
        }
        return true
    }),
    body("name").isLength({min:3}).withMessage("Name should be 3th sumbols min")
]