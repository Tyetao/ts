import {Request, Response, NextFunction} from "express";
import {UserModel} from "../models/User";

class User {
  constructor() {
  }

  /**
   * 登录
   * @param {Request} name 用户名
   * @return {name} 用户名
   */
  public login(req: Request, res: Response): void {
    let name = req.body.name || '';
    if (name === '') {
      return;
    }

    UserModel.findOne({name: name}, (err, data) => {
      if (err) {
        return res.json({
          "error_code": 'Y9999',
          "data": null,
          "msg": "账号不存在"
        });
      }
      if (data) {
        return res.json({
          "error_code": 'Y10000',
          "data": data["name"],
          "msg": "登录成功"
        });
      } else {
        return res.json({
          "error_code": 'Y9999',
          "data": null,
          "msg": "账号不存在"
        });
      }
    })
  }

  /**
   * 注册
   * @param {Request} name 用户名
   * @param {Request} password 密码
   * @returns {name} 用户名
   */
  public signup(req: Request, res: Response, next: NextFunction): void {
    console.log(req.body);
    let name = req.body.name || '';
    let password = req.body.password || '';

    if (name === '') {
      res.status(403).end('账号不能为空');
      return;
    }

    if (typeof password === 'string') {
      if (password.length < 6 || password.length > 10) {
        res.status(403).end('密码长度需要在6~10');
        return;
      }
    }

    let User = new UserModel({
      name: name,
      password: password
    });

    User.save((err, data) => {
      if (err) {
        return res.json({
          "error_code": 'Y9999',
          "data": null,
          "msg": err.message
        });
      } else {
        return res.json({
          "error_code": 'Y10000',
          "data": data["name"],
          "msg": "请求成功"
        });
      }
    });
  }

}

export const UserCtrl = new User();