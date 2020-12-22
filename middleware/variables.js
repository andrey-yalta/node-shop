module.exports = function (req,res, next) {
    // это короче специальная функция, которая при вызове её просто делает значение аутинтификатед в тру
    //типа диспатча короче
    res.locals.isAuth = req.session.isAuthentificated
    res.locals.csrf = req.csrfToken()
    next()
}