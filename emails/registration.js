const keys = require("../keys")

module.exports = function (email) {
    // return{
    //     to:email,
    //     from: keys.EMAIL_FROM,
    //     subject:"registration at node-shop was successful",
    //     html:`"<h1> Welcome to our shop</h1> <p>you are successful create an account - ${email}</p>
    //             <hr/> <a href="${keys.BASE_URL}"> Course-shop</a>"`
    // }
    return  {
        to: email, // Change to your recipient
        from: {
            name:"courses-shop",
            email:keys.EMAIL_FROM,
        },
        subject:"registration at node-shop was successful",
            html:`"<h1> Welcome to our shop</h1> <p>you are successful create an account - ${email}</p>
                <hr/> <a href="${keys.BASE_URL}"> Course-shop</a>"`
    }
}