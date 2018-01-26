import * as envConfig from "../../config";

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
}

export const UtilCtrl = new Util();