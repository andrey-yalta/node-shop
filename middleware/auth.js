module.exports = function (req, res, next) {
    // это метод проверки параметра isauthentificated который мы будем использовать при переходе по роутам
    if(!req.session.isAuthentificated){
        return res.redirect("/auth/login")
    }
    next()
}