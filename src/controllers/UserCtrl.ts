import {Request, Response, NextFunction} from "express";
import {UserModel} from "../models/User";
import * as bcrypt from "bcrypt-nodejs";
import {UtilCtrl} from "../lib/util";

class User {
  constructor() {
  }

  /**
   * 登录
   * @param {Request} name 用户名
   * @return {name} 用户名
   */
  public login(req: Request, res: Response): void {
    console.log('请求了登录');
    const name = req.body.name || '';
    const password = req.body.password || '';

    UserModel.findOne({name: name}, (err, user) => {
      if (err) {
        return res.json({
          "error_code": 'Y8888',
          "data": null,
          "msg": "登录失败"
        });
      }
      if (user) {
        bcrypt.compare(password, user["password"], (err, userPass) => {
          if (err) {
            return res.json({
              "error_code": 'Y8888',
              "data": null,
              "msg": "账号或密码错误"
            });
          }
          if (userPass) {
            res.status(200).json(
              {
                "error_code": "Y10000",
                "data": user,
                "token": UtilCtrl.getToken(user.id),
                "msg": "登录成功"
              }
            );
          }
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
    console.log('请求了signup')
    let name = req.body.name || '';
    let password = req.body.password || '';
    let roles = req.body.roles || [];

    if (name === '') {
      res.status(415).end('账号不能为空');
      return;
    }

    if (typeof password === 'string') {
      if (password.length < 6 || password.length > 10) {
        res.status(415).end('密码长度需要在6~10');
        return;
      }
    }

    let User = new UserModel({
      name: name,
      password: password,
      roles: roles
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


  /**
   * 退出登录
   * @param {Request} req
   * @param {Response} res
   */
  public logout(req: Request, res: Response): void {
    res.json({
      "error_code": 'Y10000',
      "data": null,
      "msg": "退出成功"
    })
  }


  /**
   * 获取登录用户信息
   * @param {Request} req
   * @param {e.Response} res
   */
  public userInfo(req: Request, res: Response): void {
    const name = req.query.name || '';
    console.log(name)
    UserModel.findOne({name: name}, (err, user) => {
      if (err) {
        return res.json({
          "error_code": 'Y8888',
          "data": null,
          "msg": "登录失败"
        });
      }
      if (user) {
        res.status(200).json(
          {
            "error_code": "Y10000",
            "data": user,
            "msg": "登录成功"
          }
        );
      } else {
        return res.json({
          "error_code": 'Y9999',
          "data": null,
          "msg": "账号不存在"
        });
      }
    })
  }

  public usersList(req: Request, res: Response): void {
    UserModel.find((err, users) => {
      res.status(200).json(
        {
          "error_code": "Y10000",
          "data": users,
          "msg": "登录成功"
        }
      );
    })
  }

}

export const UserCtrl = new User();