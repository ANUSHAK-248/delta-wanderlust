const User = require("../models/user.js");

module.exports.renderSignupPage =  (req, res) => {
    res.render("./users/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try{
        let { username, email, password } = req.body;
        let newuser = new User({email, username});
        let reguser = await User.register(newuser, password);
        console.log(`Registered ${username} successfully`);

        req.login(reguser, (err) => {    
            if(err){
                req.flash("error", "Failed to login after signup");
                res.redirect("/user/login");
            }else{
                req.flash("success", "Logged in successfully after signup", req.user.username);
                res.redirect("/listings");
            }    
        })
    }
    catch(err){
        req.flash("error", err.message);
        res.redirect("/user/signup");
    }
}

module.exports.renderLoginPage =  (req, res) => {
    res.render("./users/login.ejs");
}

module.exports.login = async (req, res) => {
    console.log(`Logged in ${req.body.username} successfully`);
    if(res.locals.redirectUrl){
        req.flash("success", "Now you are logged in ",req.user.username);
        res.redirect(res.locals.redirectUrl);
    }
    else{
        req.flash("success", "Welcome back to wanderlust",req.user.username);
        res.redirect("/listings");
    }
}

module.exports.logout = (req, res, next) => {
    req.logout((err)=> {
        if(err){
            req.flash("error", "Failed to logout");
            res.redirect("/listings");
        }else{
            req.flash("success", "Logged out successfully");
            res.redirect("/listings");
        }
    }) 
}