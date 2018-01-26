import app from './app';

require('./routes')(app);
import {UtilCtrl} from "./lib/util";

//环境变量
const envJson = UtilCtrl.detectionEnv();

app.listen(envJson["ENV_PORT"], (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`server is listening on ${envJson["ENV_PORT"]}`)
});