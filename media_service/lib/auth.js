class Auth {
    setSession = (user, done) => {
        done(null, user);
    }
    
    verifyPermission = (user, done) => {
        return done(null, user);
    }

    isAuthenticated = () => {
        return (req, res, next) => {
            console.log(req.isAuthenticated());
            if (!req.isAuthenticated()) {
                return res.status(403).json({
                    error: true,
                    message: "Người dùng không được phép truy cập tài nguyên này."
                });
            }
    
            next();
        }
    }
}

module.exports = new Auth();