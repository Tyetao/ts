import {UserCtrl} from "../controllers/UserCtrl";

module.exports = (App) => {

  App.use((req, res, next) => {
    console.log(req.session);
    if (req.path === "/login" || req.path === "/signup") {
      next();
    } else {
      if (req.session.user) {
        next();
      } else {
        res.end('请登录');
      }
    }
  });

  App.post("/login", UserCtrl.login);
  App.post("/signup", UserCtrl.signup);
  App.post("/testApi", UserCtrl.testApi);
  App.post("/logout", UserCtrl.logout);
};
