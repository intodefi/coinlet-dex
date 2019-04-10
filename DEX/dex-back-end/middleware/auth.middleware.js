exports.isUserLoggedIn = (req, res, next) => {
    console.log('SESSION = ', req.session)
    if (req.session && req.session.loggedIn) {
        return next();
    }
    return res.redirect('/admin/login');
};