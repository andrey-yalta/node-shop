const {Router} = require("express")
const bcrypt = require("bcryptjs") // библиотека для хэширования пароля
const User = require("../models/user")
const router = Router()
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
            }

        }catch (e) {
            console.log(e)
        }
    })
module.exports = router