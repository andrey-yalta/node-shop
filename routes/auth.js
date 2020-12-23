const {Router} = require("express")
const bcrypt = require("bcryptjs") // библиотека для хэширования пароля
const User = require("../models/user")
const nodemailer = require("nodemailer")
const sendgrid = require("nodemailer-sendgrid-transport")
const router = Router()
const keys = require("../keys")
const regEmail = require("../emails/registration")
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(keys. SENDGRID_API_KEY)
const crypto =  require("crypto")
const resetEmail = require("../emails/reset")

const transporter = nodemailer.createTransport(sendgrid({
    auth:{api_key: keys.SENDGRID_API_KEY}
}))
    router.get("/login", async (req,res)=>{
        res.render("auth/login",{
            title: "Authorization",
            isLogin: true,
            registerError: req.flash("registerError"),// получение ошибки если она есть
            loginError: req.flash("loginError")

        })
    })

    router.get("/logout", async (req,res)=>{
        // ниже представлен метод очищения сессии
        req.session.destroy(()=>{
            res.redirect("/auth/login#login")
        })

    })

     router.post("/login", async (req, res)=>{
        try{
            const {email, password} =  req.body
            const candidate = await  User.findOne({email})
            if(candidate){
                const isSame = await bcrypt.compare(password, candidate.password)
                if(isSame){
                    // ждем пока получим пользователя
                    req.session.user =candidate
                    req.session.isAuthentificated = true
                    req.session.save((err)=>{
                        // этот метод вызван чтобы мы сначала получили пользователя, а толко потом делали редирект
                        if(err){
                            throw err
                        }
                        res.redirect("/")
                    })
                }else{
                    req.flash("loginError", "bad password")
                    res.redirect("/auth/login#login")
                }
            }else{
                req.flash("loginError", "User not found")
                res.redirect("/auth/login#login")
            }
        } catch (e) {
            console.log(e)
        }


    })


    router.post("/register", async (req,res)=>{
        try{
            const{email, password, repeat, name} = req.body
            const candidate = await User.findOne({email})
            if(candidate){
                req.flash("registerError", "user with this email already exists") // прокидываение ошибки
                res.redirect("/auth/login#register")
            }else{
                const hashPassword = await bcrypt.hash(password, 10)
                const user = new User({
                    email, name, password: hashPassword, cart:{items:[]}
                })
                await user.save()
                res.redirect("/auth/login#login")
                 sgMail
                    .send(regEmail(email))
                    .then(() => {
                        console.log('Email sent')
                    })
                    .catch((error) => {
                        console.error(error)
                    })

            }

        }catch (e) {
            console.log(e)
        }
    })

    router.get("/reset", (req,res)=>{
        res.render("auth/reset",{
            title:"lost password?",
            error:req.flash("error")
        })
    })

    router.post("/reset", (req,res)=>{
        try{
            crypto.randomBytes(32,async(err, buffer)=>{
                 if(err){
                     req.flash("error", "something wrong. try again")
                     return res.redirect("/auth/reset" )
                 }
                const token = buffer.toString('hex')
                const candidate = await User.findOne({email: req.body.email})
                if(candidate){
                    candidate.resetToken =token
                    candidate.resetTokenExp = Date.now() +60*60*1000
                    await candidate.save()
                    await sgMail
                        .send(resetEmail(candidate.email,token))
                        .then(() => {
                            console.log('Reset email sent')
                            res.redirect("/auth/login")
                        })
                        .catch((error) => {
                            console.error(error)
                        })
                }else{
                    req.flash("error", "This email not found")
                    return res.redirect("/auth/reset" )
                }
            })
        }catch (e) {
            console.log(e)
        }
    })

    router.get("/password/:token", async(req,res)=>{
        if(!req.params.token){
            return res.redirect("/auth/login")
        }
        try {
            const user = await User.findOne({
                resetToken: req.params.token,
                resetTokenExp: {$gt: Date.now()}  // gt -это какой-то параметр с датой. здесь ообще мы сравниваем дату в сессии и текущую дату не больше ли она ?
            })
            if(!user){
                return res.redirect("/auth/login")
            }
            else {
                res.render("auth/password",{
                    title:"restore access",
                    error:req.flash("error"),
                    userId: user._id.toString(),
                    token: req.params.token
                })
            }
        }catch (e) {
            console.log(e)
        }

    })

    router.post("/password", async (req,res)=>{
        try{
            const user = await User.findOne({
                _id:req.body.userId, // здесь мы проверяем если равно id из модели user id в нашей форме
                resetToken: req.body.token,  // здесь мы проверяем если равно token из модели user token в нашей форме
                resetTokenExp: {$gt: Date.now()}  // здесь мы проверяем если равно время из модели user нашему времни ???
            })
            // если пользователь с теми параметрами найден
            if(user){
                user.password = await bcrypt.hash(req.body.password, 10) // хэшируем новый пароль
                user.resetToken = undefined // обнуляем значения токенов
                user.resetTokenExp = undefined
                await user.save() // ждем пока сохранится
                res.redirect("/auth/login") // идем на страницу логина
            }
            else{
                res.redirect("/auth/login")
            }
        }
        catch (e) {
            req.flash("loginError", "lifetime of token is over")
            console.log(e)
        }
    })

module.exports = router