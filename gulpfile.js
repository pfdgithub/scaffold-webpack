const gulp = require('gulp');
const gLog = require('fancy-log');
const gError = require('plugin-error');
const gZip = require('gulp-zip');
const del = require('del');
const path = require('path');
const shell = require('shelljs');
const yargs = require('yargs');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

const pkg = require('./package.json');

// 环境枚举
const envEnum = {
  dev: 'dev',
  test: 'test',
  prod: 'prod'
};

// 输出任务日志
const taskLog = (name, ...message) => {
  gLog(`Log in plugin '[Task] ${name}'`, '\nMessage:\n    ', ...message);
};

// 获取任务错误
const getTaskError = (name, message) => {
  return new gError(`[Task] ${name}`, message, {
    // showStack: true
  });
};

// 输出函数日志
const funLog = (name, ...message) => {
  gLog(`Log in plugin '[Funtion] ${name}'`, '\nMessage:\n    ', ...message);
};

// 获取函数错误
const getFunError = (name, message) => {
  return new gError(`[Funtion] ${name}`, message, {
    // showStack: true
  });
};

// 获取 package 中版本号
const getPkgVersion = () => {
  let ver = pkg && pkg.version;

  funLog('getPkgVersion', ver);

  return ver;
};

// 获取当前分支名
const getGitBranch = () => {
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
    funLog('getGitBranch', branch);
  }
  else {
    funLog('getGitBranch', 'No output');
  }

  return branch;
};

// 获取环境参数
const getProcessEnv = () => {
  let env = undefined;
  let argv = yargs.argv;

  if (typeof (argv.env) !== 'undefined') {
    let _env = argv.env.toString().trim();
    env = envEnum[_env];
  }

  if (!env) {
    throw getFunError('getProcessEnv', 'Invalid environment type (e.g. --env=prod)');
  }

  funLog('getProcessEnv', env);

  return env;
};

// 获取 webpack 配置
const getWebpackConfig = () => {
  let env = getProcessEnv();
  let uri = path.join(__dirname, 'cfg', env);
  let config = require(uri);

  funLog('getWebpackConfig', uri);

  return config;
};

// 检查分支名与版本号是否匹配
const checkVersion = (cb) => {
  let pkgVersionStr = getPkgVersion(); // 1.0.0
  let gitBranchStr = getGitBranch(); // dev-v1.0.0
  let pkgVersionArr = pkgVersionStr.match(/^(\d+)\.(\d+)\.(\d+)$/);
  let gitBranchArr = gitBranchStr.match(/^([\w-]+)-v((\d+)\.(\d+)\.(\d+))$/);

  let ignoreBranch = 'master';
  if (gitBranchStr === ignoreBranch) {
    funLog('checkVersion', `Ignore check packageVersion when branchName is ${ignoreBranch}`);
    return cb();
  }

  if (pkgVersionArr && gitBranchArr) {
    let pkgVersion = pkgVersionArr[0]; // 1.0.0
    let gitBranchEnv = gitBranchArr[1]; // dev
    let gitBranchVer = gitBranchArr[2]; // 1.0.0

    if (pkgVersion === gitBranchVer) {
      funLog('checkVersion', `Current packageVersion (${pkgVersion}) branchName (${gitBranchVer})`);
      return cb();
    }
  }

  let gErr = getFunError('checkVersion', 'Invalid packageVersion (e.g. 1.0.0) or branchName (e.g. dev-v1.0.0)');
  cb(gErr);
};

// 清理构建文件
const cleanBuild = (cb) => {
  let buildOutput = './dist/**'; // 编译输出目录
  let buildCache = './node_modules/.cache/**'; // 编译缓存目录

  del([buildOutput, buildCache], {
    dryRun: false
  }).then((paths) => {
    funLog('cleanBuild', `'${buildOutput}' and '${buildCache}' has been cleaned`);
    cb();
  }).catch((err) => {
    let gErr = getFunError('cleanBuild', err);
    cb(gErr);
  });
};

// 图片压缩
const imagemin = () => {
  /**
   * gulp-imagemin 依赖的部分图片处理库，需要外部资源。
   * 会在安装时从 github 下载编译后的文件，或从外部站点下载源码后进行编译。
   * 为避免依赖安装耗时过长，将其作为 peerDependencies 依赖，需要自行安装。
   */
  let gImagemin;
  try {
    gImagemin = require('gulp-imagemin');
  } catch (error) {
    gImagemin = null;
  }

  if (!gImagemin) {
    let gErr = getFunError('imagemin', 'Please manually execute "npm i gulp-imagemin"');
    throw gErr;
  }

  let src = './src/**/*.{gif,jpg,png,svg}';
  let dest = './src/';

  let plugins = [
    gImagemin.gifsicle(),
    gImagemin.jpegtran(),
    gImagemin.optipng(),
    gImagemin.svgo()
  ];
  let options = {
    verbose: true
  };

  funLog('imagemin', src, dest);

  return gulp.src(src)
    .pipe(gImagemin(plugins, options))
    .pipe(gulp.dest(dest));
};

// zip 压缩
const compress = () => {
  let ver = getPkgVersion(); // 1.0.0
  let src = ['./dist/**', '!**/*.map'];
  let dest = './dist/';
  let zipName = `${ver}.zip`;

  funLog('compress', src, dest);

  return gulp.src(src)
    .pipe(gZip(zipName))
    .pipe(gulp.dest(dest));
};

// 开发服务器
const devServer = (cb) => {
  let config = getWebpackConfig();
  let devServer = config.devServer;
  let port = devServer.port;

  funLog('devServer', `Starting the server at 0.0.0.0:${port}`);

  webpackDevServer.addDevServerEntrypoints(config, devServer);
  new webpackDevServer(webpack(config), devServer).listen(port, '0.0.0.0', (err) => {
    if (err) {
      let gErr = getFunError('devServer', err);
      return cb(gErr);
    }

    cb();
  });
};

// 构建项目
const buildProject = (cb) => {
  let config = getWebpackConfig();
  let devServer = config.devServer;
  let statsCfg = devServer.stats;

  funLog('buildProject', 'Building...');

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

// 压缩图片文件
gulp.task('imagemin', () => {
  return imagemin();
});

// 压缩构建文件
gulp.task('compress', () => {
  return compress();
});

// 启动开发服务器
gulp.task('serve', [/* 'check', */ 'clean'], (cb) => {
  devServer(cb);
});

// 构建项目
gulp.task('build', [/* 'check', */ 'clean'], (cb) => {
  buildProject(cb);
});

// 默认任务
gulp.task('default', () => {
  taskLog('default', 'Please use npm script');
});
