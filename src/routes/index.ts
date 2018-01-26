import {UserCtrl} from "../controllers/UserCtrl";

module.exports = (App) => {
  App.post("/login", UserCtrl.login);
  App.post("/signup", UserCtrl.signup);
};
