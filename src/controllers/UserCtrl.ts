import {Request, Response, NextFunction} from "express";
import {UserModel} from "../models/User";
import * as bcrypt from "bcrypt-nodejs";
import {UtilCtrl} from "../lib/util";
import * as mongoose from "mongoose";

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
    const reqBody = req.body;
    const id = req.body.id;
    const name = req.body.name || '';
    let password = req.body.password || '';
    const roles = req.body.roles || '';

    if (name === '') {
      res.status(415).end('账号不能为空');
    }
    if (typeof password === 'string') {
      if (password.length < 6 || password.length > 10) {
        res.status(415).end('密码长度需要在6~10');
      }
    }
    if (id) {
      UserModel.findById({_id: id}, (err, user_id) => {
        if (err) {
          res.json({
            error_code: "Y10001",
            data: null,
            msg: "此用户不存在"
          })
        }
        if (user_id) {
          bcrypt.genSalt(10, (err, salt) => {
            if (err) { return next(err); }
            bcrypt.hash(password, salt, undefined, (err: mongoose.Error, hash) => {
              if (err) { return next(err); }
              password = hash;
              UserModel.update({_id: id}, {$set: {"roles": roles, "password": password}}, (err, data) => {
                if (err) {
                  console.log(err);
                  return;
                }
                res.json({
                  error_code: "Y10000",
                  data: data,
                  msg: "更新成功"
                })
              });
            });
          });
        } else {
          res.json({
            error_code: "Y10001",
            data: null,
            msg: "此用户不存在"
          })
        }
      })
    } else {

      UserModel.findOne({name: name}, (err, data) => {
        if (err) {
          console.log(err);
          return;
        }

        if (data) {
          res.json({
            error_code: "Y10001",
            data: null,
            msg: data["name"] + "用户名已存在"
          })
        } else {
          var _user = new UserModel(reqBody);
          _user.save(function (err) {
            if (err) {
              console.log(err);
              return;
            }
            res.json({
              error_code: "Y10000",
              data: "ok",
              msg: "添加成功"
            })
          })
        }
      });
    }
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

  /**
   * 后台账号列表查询
   * @param {e.Request} req
   * @param {e.Response} res
   */
  public usersList(req: Request, res: Response): void {
    UserModel.find((err, users) => {

      if (err) {
        return console.log(err);
      }

      res.status(200).json(
        {
          "error_code": "Y10000",
          "data": users,
          "msg": "登录成功"
        }
      );
    })
  }

  /**
   * 删除账号
   * @param {e.Request} req
   * @param {e.Response} res
   */
  public removeAccount(req: Request, res: Response) {
    const id = req.query.id || '';
    if (id) {
      UserModel.remove({_id: id}, (err) => {
        if (err) {
          res.json({
            "error_code": 'Y9999',
            "data": null,
            "msg": "删除失败"
          })
        }

        res.status(200).json(
          {
            "error_code": "Y10000",
            "data": null,
            "msg": "删除成功"
          }
        );
      })
    } else {
      res.json({
        "error_code": 'Y9999',
        "data": null,
        "msg": "没有该账户"
      })
    }
  }
}

export const UserCtrl = new User();