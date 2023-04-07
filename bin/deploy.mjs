import fs from 'fs';
import archiver from 'archiver';
import ssh2 from 'ssh2';
import readline from 'readline';
import readlinePromises from 'readline/promises';
import { execSync } from 'child_process';

//配置项
const PAPER_FILENAME = 'dist'; // 接收压缩文件名称参数
const BUILD_CMD = 'npm run build';
const DEPLOY_CONFIG = {
  prod: {
    host: '123.58.211.126', //服务器IP
    port: 22, //服务器端口
    username: 'root', //服务器ssh登录用户名
    // password: '', //服务器ssh登录密码
    serverpath: '/www/wwwroot/404dh/', //服务器web目录 切记尾部要加/
  },
};

function errorLog(err) {
  console.log('\x1B[31m%s\x1b[0m', `> ${err}`);
}
function infoLog(info) {
  console.log('\x1B[36m%s\x1b[0m', `> ${info}`);
}

const hiddenQuestion = (query) =>
  new Promise((resolve) => {
    console.log(query);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl._writeToOutput = () => {};
    const stdin = process.openStdin();
    process.stdin.on('data', (char) => {
      char = char.toString('utf-8');
      if (['\n', '\r', '\u0004'].includes(char)) {
        stdin.pause();
      } else if (['\u0003'].includes(char)) {
        process.exit(0);
      } else {
        process.stdout.clearLine();
        readline.cursorTo(process.stdout, 0);
      }
    });
    rl.question('', (value) => {
      rl.history = rl.history.slice(1);
      rl.close();
      resolve(value);
    });
  });

// 环境询问
const question1 = async () => {
  const rl = readlinePromises.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await rl.question(
    `请输入希望的部署环境 ${Object.keys(DEPLOY_CONFIG).join(' 或 ')} (0表示不希望部署到服务器) \n`
  );
  rl.close();
  const environment = answer.trim();
  if (environment in DEPLOY_CONFIG) {
    if (
      DEPLOY_CONFIG[environment].host &&
      DEPLOY_CONFIG[environment].port &&
      DEPLOY_CONFIG[environment].username &&
      DEPLOY_CONFIG[environment].serverpath
    ) {
      return DEPLOY_CONFIG[environment];
    } else {
      return Promise.reject('缺少该部署环境的 ssh 连接必要参数');
    }
  } else if (environment == 0) {
    infoLog('只打包压缩，不部署到服务器');
    return 0;
  } else {
    return Promise.reject('意料之外的环境');
  }
};

// 密码询问
const question2 = async (serverHost) => {
  // const rl = readlinePromises.createInterface({
  //   input: process.stdin,
  //   output: process.stdout,
  // });
  // const pwd = await rl.question(`请输入服务器 ${serverHost} 的密码：`);
  // rl.close();
  // return pwd;
  const password = await hiddenQuestion(`请输入服务器 ${serverHost} 的密码：`);
  return password;
};

// 打包zip
function inquiry() {
  return new Promise((resolve, reject) => {
    // 创建文件输出流
    let output = fs.createWriteStream(`${PAPER_FILENAME}.zip`);
    let archive = archiver('zip', {
      zlib: { level: 9 }, // 设置压缩级别
    });
    // 文件输出流结束
    output.on('close', function () {
      infoLog(`已完成文件压缩：${archive.pointer()} 字节,`);
      resolve();
    });
    // 数据源是否耗尽
    output.on('end', function () {
      console.log('> 数据源已耗尽');
    });
    // 存档警告
    archive.on('warning', function (err) {
      if (err.code === 'ENOENT') {
        reject('stat故障和其他非阻塞错误');
      } else {
        reject(err);
      }
    });
    // 存档出错
    archive.on('error', function (err) {
      reject(err);
    });
    // 通过管道方法将输出流存档到文件
    archive.pipe(output);
    //打包build里面的所有文件和目录
    archive.directory(PAPER_FILENAME + '/', false);
    //完成归档
    archive.finalize();
  });
}

function useExec(conn, cmd) {
  // 所有错误命令直接关闭服务器连接
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) {
        conn.end();
        reject(`异常抛出 ${err.toString()}`);
      }
      stream
        .on('close', (code, signal) => {
          // 结束 code: 代码 signal: 信号
          if (code !== 0) {
            conn.end();
            reject(`脚本异常退出code: ${code}，异常信号signal:${signal}`);
          }
          resolve();
        })
        .on('data', (data) => {
          // 服务器输出的信息
          // console.log(data.toString());
        })
        .stderr.on('data', (data) => {
          conn.end();
          reject(`${data.toString()}`);
        });
    });
  });
}

function connect(serverConfig) {
  return new Promise((resolve, reject) => {
    const conn = new ssh2.Client();
    infoLog('准备连接服务器');
    conn
      .on('ready', () => {
        infoLog('连接服务器成功 准备上传文件');
        // 保证服务器下当前目录存在
        // `mkdir -p ${serverConfig.serverpath} && cd ${serverConfig.serverpath} ` && rm -rf *`
        useExec(conn, `mkdir -p ${serverConfig.serverpath} && cd ${serverConfig.serverpath} `)
          .then(() => {
            conn.sftp((err, sftp) => {
              sftp.fastPut(`${PAPER_FILENAME}.zip`, `${serverConfig.serverpath}${PAPER_FILENAME}.zip`, {}, (err) => {
                if (err) {
                  reject('文件上传失败');
                }
                infoLog(`文件上传完成 : ${PAPER_FILENAME}.zip`);
                infoLog(`服务器正在 “${serverConfig.serverpath}” 路径解压部署...`);
                // 解压文件停止连接
                useExec(
                  conn,
                  `cd ${serverConfig.serverpath} && \
                   unzip -o ${PAPER_FILENAME}.zip && \
                   rm -rf ${PAPER_FILENAME}.zip && \
                   exit`
                )
                  .then(() => {
                    conn.end();
                    infoLog('服务器部署完成！');
                    resolve();
                  })
                  .catch(reject);
              });
            });
          })
          .catch((err) => {
            reject(err);
          });
      })
      .on('error', (err) => {
        reject(`连接服务器失败 ${err.toString()}`);
      })
      .connect({
        host: serverConfig.host,
        port: serverConfig.port,
        username: serverConfig.username,
        password: serverConfig.password,
      });
  });
}

const init = async () => {
  try {
    const platfom = await question1();
    if (platfom) {
      if (!platfom.password) {
        const password = await question2(platfom.host);
        platfom.password = password;
      }
    }
    infoLog('正在打包中...');
    execSync(BUILD_CMD);
    infoLog('正在压缩文件...');
    await inquiry();

    if (platfom) {
      await connect(platfom);
      // 删除本地压缩的 dist.zip
      infoLog('删除本地打包文件...');
      fs.unlinkSync(`${PAPER_FILENAME}.zip`);
      fs.rmSync(`${PAPER_FILENAME}`, { recursive: true });
      infoLog('全部完成！');
    }
  } catch (error) {
    errorLog(error.toString());
  }
};

init();
