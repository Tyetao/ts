import {UserCtrl} from "../controllers/UserCtrl";
import * as jwt from "jwt-simple";

module.exports = (App) => {
  App.use((req, res, next) => {
    console.log('path:' + req.path);
    if (req.path === "/login") {
      next();
    } else {
      if (req.method != "OPTIONS") {
        let token = req.headers.authorization;
        if (token) {
          let decoded = jwt.decode(token, 'jwtTokenSecret');
          if (decoded.exp <= Date.now() || decoded.aud !== 'jser') {
            res
              .status(401)
              .json({
                error_code: '401',
                data: null,
                message: 'token已过期'
              })
          } else {
            next();
          }
        } else {
          res
            .status(401)
            .json({
              error_code: '401',
              data: null,
              message: '用户没有权限'
            })
        }
      } else {
        next()
      }
    }
  });
  App.post("/login", UserCtrl.login);
  App.post("/signup", UserCtrl.signup);
  App.get("/userInfo", UserCtrl.userInfo);
  App.get("/usersList", UserCtrl.usersList);
  App.post("/logout", UserCtrl.logout);
  App.get("/removeAccount", UserCtrl.removeAccount);
};
