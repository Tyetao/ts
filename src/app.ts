import * as express from 'express';
import {Request, Response, NextFunction} from "express";
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import * as session from "express-session";
import * as mongo from "connect-mongo";
import {UtilCtrl} from "./lib/util";
import {DBCtrl} from "./db";

//环境变量
const envJson = UtilCtrl.detectionEnv();
let DBURL =  `mongodb://${envJson["DB_USERNAME"]}:${envJson["DB_PASSWORD"]}@${envJson["DB_HOSTNAME"]}:${envJson["DB_PORT"]}/${envJson["DB_DATABASE"]}`;
const sessionExpires = 24*60*60*1000; //session有效时间

class App {
  public express;

  constructor() {
    this.express = express();
    this.init();
    this.connectDB();
    // this.authentication();
  }

  private init(): void {
    /*跨域访问*/
    this.express.all('*', function(req, res, next) {
      res.header('Access-Control-Allow-Origin', 'http://localhost:9528');
      res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');
      res.header("Content-Type", "application/json;charset=utf-8");
      // res.header('Access-Control-Max-Age', 3000);
      res.header('Access-Control-Allow-Credentials','false');
      next();
    });
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({extended: true}));
    this.express.use(logger("dev"));
}

  /**
   * 链接数据库
   */
  private connectDB(): void {
    DBCtrl.connection();
  }

  /**
   * session持久化
   */
  private authentication(): void {
    const MongoStore = mongo(session);
    this.express.use(session({
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: sessionExpires
      },
      secret: 'tanyetao',
      store: new MongoStore({
        url: DBURL,
        autoReconnect: true
      })
    }));
  }
}

export default new App().express;