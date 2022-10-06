const User = require("../model/User");

function auth(req, res, next) {
  const token = req.cookies.x_auth;

  User.findUserByToken(token, (err, user) => {
    if (err) return next(err);

    if (!user)
      return res.send({
        isAuth: false,
        error: true,
      });

    req.user = user;
    req.token = token;

    next();
  });
}

module.exports = auth;
