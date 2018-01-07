let gulp = require('gulp');
let gLog = require('fancy-log');
let gError = require('plugin-error');
let gZip = require('gulp-zip');
let del = require('del');
let open = require('open');
let path = require('path');
let shell = require('shelljs');
let yargs = require('yargs');
let webpack = require('webpack');
let WebpackDevServer = require('webpack-dev-server');

let pkg = require('./package.json');

// 环境枚举
let envEnum = {
  dev: 'dev',
  test: 'test',
  prod: 'prod'
};

// 输出任务日志
let taskLog = (name, ...message) => {
  gLog(`Log in plugin '[Task] ${name}'`, '\nMessage:\n    ', ...message);
};

// 获取任务错误
let getTaskError = (name, message) => {
  return new gError(`[Task] ${name}`, message, {
    // showStack: true
  });
};

// 输出函数日志
let funLog = (name, ...message) => {
  gLog(`Log in plugin '[Funtion] ${name}'`, '\nMessage:\n    ', ...message);
};

// 获取函数错误
let getFunError = (name, message) => {
  return new gError(`[Funtion] ${name}`, message, {
    // showStack: true
  });
};

// 获取 package 中版本号
let getPkgVersion = () => {
  let ver = pkg && pkg.version;

  funLog('getPkgVersion', ver);

  return ver;
};

// 获取当前分支名
let getGitBranch = () => {
  let branch = '';

  // http://stackoverflow.com/questions/6245570/how-to-get-the-current-branch-name-in-git/12142066
  let shellObj = shell.exec('git symbolic-ref --short HEAD', {
    async: false,
    silent: true
  });

  let code = shellObj.code;
  let stderr = shellObj.stderr;
  let stdout = shellObj.stdout;
  if (code !== 0 && stderr.length > 0) {
    throw getFunError('getGitBranch', stderr);
  }
  else if (stdout.length > 0) {
    branch = stdout.replace(/\n$/, ''); // 结尾含有\n字符
    funLog('getGitBranch', stdout);
  }
  else {
    funLog('getGitBranch', 'No output');
  }

  return branch;
};

// 获取环境参数
let getProcessEnv = () => {
  let env = undefined;
  let argv = yargs.argv;

  if (argv.env && envEnum[argv.env]) {
    env = envEnum[argv.env];
  }

  if (!env) {
    throw getFunError('getProcessEnv', 'Invalid environment type (e.g. --env=prod)');
  }

  funLog('getProcessEnv', env);

  return env;
};

// 获取 webpack 配置
let getWebpackConfig = () => {
  let env = getProcessEnv();
  let uri = path.join(__dirname, 'cfg', env);
  let config = require(uri);

  funLog('getWebpackConfig', uri);

  return config;
};

// 检查分支名与版本号是否匹配
let checkVersion = (cb) => {
  let pkgVersionStr = getPkgVersion(); // 1.0.0
  let gitBranchStr = getGitBranch(); // dev-v1.0.0
  let pkgVersionArr = pkgVersionStr.match(/^(\d+)\.(\d+)\.(\d+)$/);
  let gitBranchArr = gitBranchStr.match(/^([\w-]+)-v((\d+)\.(\d+)\.(\d+))$/);

  if (pkgVersionArr && gitBranchArr) {
    let pkgVersion = pkgVersionArr[0]; // 1.0.0
    // let gitBranchEnv = gitBranchArr[1]; // dev
    let gitBranchVer = gitBranchArr[2]; // 1.0.0

    if (pkgVersion === gitBranchVer) {
      funLog('checkVersion', `packageVersion (${pkgVersion}) branchName (${gitBranchVer})`);
      return cb();
    }
  }

  let gErr = getFunError('checkVersion', 'Invalid packageVersion (e.g. 1.0.0) or branchName (e.g. dev-v1.0.0)');
  cb(gErr);
};

// 清理构建文件
let cleanBuild = (cb) => {
  del(['./dist/**', './node_modules/.cache/**'], {
    dryRun: false
  }).then((paths) => {
    funLog('cleanBuild', paths.length);
    cb();
  }).catch((err) => {
    let gErr = getFunError('cleanBuild', err);
    cb(gErr);
  });
};

// 复制最终版本
let copyLatest = () => {
  let ver = getPkgVersion(); // 1.0.0
  let src = `./dist/${ver}/**`;
  let dest = `./dist/latest/`;

  funLog('copyLatest', src, dest);

  return gulp.src(src)
    .pipe(gulp.dest(dest));
};

// zip 压缩
let compress = () => {
  let ver = getPkgVersion(); // 1.0.0
  let src = `./dist/${ver}/**`;
  let dest = `./dist/`;
  let zipName = `${ver}.zip`;

  funLog('compress', src, dest);

  return gulp.src(src)
    .pipe(gZip(zipName))
    .pipe(gulp.dest(dest));
};

// 开发服务器
let devServer = (cb) => {
  let config = getWebpackConfig();
  let devServer = config.devServer;
  let port = devServer.port;

  funLog('devServer', `Listening at ${port}`);

  new WebpackDevServer(webpack(config), devServer).listen(port, (err) => {
    if (err) {
      let gErr = getFunError('devServer', err);
      return cb(gErr);
    }

    cb();
  });
};

// 构建项目
let buildProject = (cb) => {
  let config = getWebpackConfig();
  let devServer = config.devServer;
  let statsCfg = devServer.stats;

  webpack(config, (err, stats) => {
    if (err) {
      let gErr = getFunError('buildProject', err);
      return cb(gErr);
    }

    let errors = stats.compilation.errors;
    // let errors = stats.toJson().errors;
    if (errors.length > 0) {
      let gErr = getFunError('buildProject', errors[0]);
      return cb(gErr);
    }

    funLog('buildProject', stats.toString(statsCfg));
    cb();
  });
};

// 检查版本号
gulp.task('check', (cb) => {
  checkVersion(cb);
});

// 清理目录
gulp.task('clean', (cb) => {
  cleanBuild(cb);
});

// 复制当前构建版本为最终版本
gulp.task('copyLatest', () => {
  return copyLatest();
});

// 压缩构建文件
gulp.task('compress', () => {
  return compress();
});

// 启动开发服务器
gulp.task('serve', ['check', 'clean'], (cb) => {
  devServer(cb);
});

// 构建项目（客户端构建）
gulp.task('clientBuild', ['check', 'clean'], (cb) => {
  buildProject(cb);
});

// 构建项目（服务器构建）
gulp.task('build', ['clean'], (cb) => {
  buildProject(cb);
});

// 默认任务
gulp.task('default', () => {
  taskLog('default', 'Please use npm script');
});
