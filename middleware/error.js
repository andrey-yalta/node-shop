module.exports = function (req,res,next) {
    res.status(404).render("404",{ // здесь мы прописываем что если статус 404 то мы рендерим наш 404.hbs
        title:" page not found"
    })
}