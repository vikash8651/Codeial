const User = require('../models/user');


module.exports.profile = function (req, res) {
    if(req.cookies.user_id){
       User.findById(req.cookies.user_id).then((user)=>{
        if(user){
            return res.render('user_profile',{
                title:"User Profile",
                user:user
            })
        }
        return res.redirect('/users/sign-in');
       }).catch(err=>{
        return res.redirect('/users/sign-in');
       })
    }
    else{
        return res.redirect('/users/sign-in');
    }
    

}

//render the sign up page
module.exports.signUp = function (req, res) {
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}

//render the sign in page
module.exports.signIn = function (req, res) {
    if(req.isAuthenticated()){
       return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

//get the sign up data
module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }
    User.findOne({ email: req.body.email }).then((user) => {
       
        if (!user) {
            User.create(req.body).then((user) => {
                return res.redirect('/users/sign-in');
            }).catch(err => {
                console.log('error in creating user while signing up', err);
                return;
            })
        } else {
            return res.redirect('back');
        }
    }).catch(err=>{
        console.log('err in finding user in signing up');
            return
    })
}
//sign in and create a session for the user
module.exports.createSession = function (req, res) {
    //steps to authenticate
    //find the user

    User.findOne({ email: req.body.email }).then((user) => {
        //handle user found
        if (user) {
            //handle password which don't match
            if (user.password != req.body.password) {
                return res.redirect('back');
            }
            //handle session creation
            res.cookie('user_id', user.id);
            return res.redirect('/users/profile');
        }
        else {
            //handle user not found
            return res.redirect('back');
        }
    }).catch(err => {
        console.log('error in finding user in signing in', err);
        return
    });
}

module.exports.destroySession = function(req, res) {
    req.logout()
        .then(() => {
            // Session destroyed successfully
            // Handle the response or perform any additional actions
            res.redirect('/'); // Example: Redirect to the homepage
        })
        .catch(error => {
            // Error occurred during session destruction
            // Handle the error appropriately
            console.error('Error destroying session:', error);
            res.sendStatus(500); // Example: Send a 500 Internal Server Error response
        });
};
