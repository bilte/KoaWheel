// 部署脚本
// 此脚本会将当前项目根目录的文件(排除node_modules, logs, tests后)
// 部署到远程服务器上的指定目录

var path = require('path');
var node_ssh = require('node-ssh');
var ssh = new node_ssh();
const { URL } = require('url');

var ignoreFolders = ['node_modules', 'logs', 'tests'];

var program = require('commander');
program
  .version('0.1.0')
  .option('-u, --url [value]', 'http://username:password@host:22/path')
  .option('-l, --locolPath [value]', 'local folder path, default root: ../')
  .parse(process.argv);

var url = new URL(program.url);
console.log(url);

const server = {
  username: url.username,
  password: url.password,
  host: url.hostname,
  port: url.port,
  // 服务器设置了用键盘输入密码, 所以这里得这样.
  tryKeyboard: true,
};

ssh.connect(server).then(() => {
  const failed = [];
  const successful = [];
  var localPath = path.join(
    __dirname,
    '../',
    program.locolPath ? program.locolPath : '',
  );
  console.log(`localPath:${localPath}`);
  ssh
    .putDirectory(localPath, url.pathname, {
      recursive: true,
      concurrency: 1,
      validate: itemPath => {
        const baseName = path.basename(itemPath);
        return (
          baseName.substr(0, 1) !== '.' &&
          ignoreFolders.indexOf(baseName) === -1
        );
      },
      tick: (localPath, remotePath, error) => {
        if (error) {
          failed.push(localPath);
        } else {
          successful.push(localPath);
        }
      },
    })
    .then(status => {
      console.log(
        `the directory transfer was ${status ? 'successful' : 'unsuccessful'}`,
      );
      console.log('failed transfers:', failed.join('\n'));
      console.log('successful transfers:', successful.length);
      // var package = require('../package.json');
      // source /etc/profile;echo $PATH;node -v
      // var str = `pm2 restart ${package.name}`;
      // console.log(str);
      // todo: 环境变量不对, 命令执行不起来
      // ssh.execCommand(str).then(function(result) {
      //   console.log('STDOUT: \n' + result.stdout);
      //   console.log('STDERR: \n' + result.stderr);
      // });
      process.exit(0);
    })
    .catch(error => {
      process.exit(0);
    });
});
