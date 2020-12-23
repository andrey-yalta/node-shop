const keys = require("../keys")
module.exports = function (email,token ) {
    return  {
        to: email, // Change to your recipient
        from: {
            name:"courses-shop",
            email:keys.EMAIL_FROM,
        },
        subject:"Восстановление доступа",
        html:`"<h1> Вы забыли пароль?</h1> <p>Если нет - проигнорируйте данное письмо </p>
                <p> иначе нажмите на ссылку нижу</p>
                <p><a href="${keys.BASE_URL}/auth/password/${token}">восстановление доступа</a></p>
                <hr/> <a href="${keys.BASE_URL}"> Course-shop</a> "`
    }
}