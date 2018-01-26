import * as express from 'express';
import * as bodyParser from "body-parser";
import * as logger from "morgan";
import {DBCtrl} from "./db";

class App {
  public express;

  constructor() {
    this.express = express();
    this.init();
    this.connectDB();
  }

  private init(): void {
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
}

export default new App().express;