import * as envConfig from "../../config";
import * as jwt from 'jwt-simple';
import app from '../app';

/**
 * 工具类
 */
class Util {
  private env: string;

  constructor() {
    this.env = process.argv[2];
  }

  /**
   * 判读环境变量，返回环境配置json
   */
  detectionEnv(): string {
    if (this.env === 'dev') {
      return envConfig.dev;
    } else if (this.env === 'product') {
      return envConfig.build;
    } else if (this.env === 'test') {
      return envConfig.test;
    }
  }

  getToken(id: object): string {
    let expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
    let token = jwt.encode({
        iss: id, // Issuer，发行者
        exp: expires, // Expiration time，过期时间
        aud: 'jser' //Audience，观众
      },
      'jwtTokenSecret'
    );
    return token;
  }
}

export const UtilCtrl = new Util();