const path = require('path');
const webpack = require('webpack');
const beautify = require('js-beautify');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackEventPlugin = require('html-webpack-event-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HappyPack = require('happypack');

const util = require('./util');

module.exports = (deployCfg, pathsCfg, publishCfg) => {
  // 提取公共依赖
  const extractBundle = {
    runtime: undefined, // webpackBootstrap
    commonBundle: [
      'react', 'react-dom',
      'commons/base', 'commons/config', 'commons/util'
    ]
  };

  // HappyPack 插件
  const happyPackPlugins = [];
  const createHappyPlugin = (id, loaders) => {
    happyPackPlugins.push(new HappyPack({
      id: id,
      loaders: loaders
    }));

    return `happypack/loader?id=${id}`;
  };

  // 获取入口配置
  const getEntries = () => {
    let entries = {};

    // 根据入口页面获取入口脚本配置
    pathsCfg.entryPages.forEach((entryPage) => {
      entries[entryPage.name] = [
        path.join(pathsCfg.entryPath, entryPage.name)
      ];
    });

    // 排除运行时
    let validBundle = {};
    for (let key in extractBundle) {
      let val = extractBundle[key];
      if (typeof (val) !== 'undefined') {
        validBundle[key] = val;
      }
    }

    return Object.assign({}, validBundle, entries);
  };

  // 获取运行时配置
  const getRuntimeChunk = () => {
    for (let key in extractBundle) {
      let val = extractBundle[key];
      if (typeof (val) === 'undefined') {
        return {
          name: key
        };
      }
    }

    return false;
  };

  // 获取分块配置
  const getSplitChunks = () => {
    let groups = {};

    // 排除运行时
    for (let key in extractBundle) {
      let val = extractBundle[key];
      if (typeof (val) !== 'undefined') {
        groups[key] = {
          chunks: 'all',
          enforce: true,
          name: key,
          test: key
        };
      }
    }

    return {
      cacheGroups: groups
    };
  };

  // 获取加载器
  const getModules = () => {
    // cache-loader 配置
    let cacheLoader = {
      loader: 'cache-loader',
      options: {
        cacheDirectory: path.resolve('node_modules/.cache/cache-loader')
      }
    };

    // mini-css-extract-plugin 配置
    let cssExtractLoader = deployCfg.assetExtractCss ? MiniCssExtractPlugin.loader : {
      loader: 'style-loader',
      options: {
        /**
         * Aborting CSS HMR due to changed css-modules locals when using react-hot-loader
         * https://github.com/webpack-contrib/style-loader/issues/320
         */
        hmr: false
      }
    };

    return {
      rules: [
        {
          enforce: 'pre',
          test: /\.(js|jsx|ts|tsx)$/,
          use: [
            cacheLoader,
            {
              loader: 'eslint-loader',
              options: {
                cache: true
              }
            }
          ],
          include: pathsCfg.srcPath
        },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: [
            cacheLoader,
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true
              }
            }
          ],
          include: pathsCfg.srcPath
        },
        {
          test: /\.html$/,
          use: [
            cacheLoader,
            {
              loader: 'html-loader',
              options: {
                interpolate: true,
                minimize: false,
                attrs: false
              }
            }
          ],
          include: pathsCfg.srcPath
        },
        {
          test: /\.(ico|png|jpg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 4096,
                name: 'img/[name].[hash].[ext]'
              }
            }
          ],
          include: pathsCfg.srcPath
        },
        {
          test: /\.(svg|eot|ttf|woff|woff2)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'font/[name].[hash].[ext]'
              }
            }
          ],
          // 字体只能放在公共样式目录
          include: pathsCfg.stylePath
        },
        {
          test: /\.svg$/,
          use: [
            cacheLoader,
            {
              loader: 'svg-sprite-loader',
              options: {
                symbolId: '[name].[hash]'
              }
            }
          ],
          // 除公共样式目录外，其他目录使用 svg-sprite
          include: pathsCfg.srcPath,
          exclude: pathsCfg.stylePath
        },
        {
          test: /\.css$/,
          use: [
            cacheLoader,
            cssExtractLoader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
                modules: 'global'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            }
          ]
          // 不限制目录（包含 node_modules 目录）
        },
        {
          test: /\.less$/,
          use: [
            cacheLoader,
            cssExtractLoader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                sourceMap: true,
                modules: 'global'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: true,
                javascriptEnabled: true, // node_modules/antd/es/style/color/ 目录下的 less 文件中存在内联 js 代码
                modifyVars: pathsCfg.antdModify.lessVars
              }
            }
          ],
          // 覆盖 antd 目录的 less 变量
          include: pathsCfg.antdModify.antdPath
        },
        {
          test: /\.less$/,
          use: [
            cacheLoader,
            cssExtractLoader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                sourceMap: true,
                modules: 'local',
                localIdentName: '[name]-[local]-[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: true
              }
            }
          ],
          // 业务组件、入口脚本、单页视图，启用 CSS Modules
          include: [
            pathsCfg.componentPath,
            pathsCfg.entryPath,
            pathsCfg.viewPath
          ]
        },
        {
          test: /\.less$/,
          use: [
            cacheLoader,
            cssExtractLoader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2,
                sourceMap: true,
                modules: 'global'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'less-loader',
              options: {
                sourceMap: true
              }
            }
          ],
          // 除业务组件、入口脚本、单页视图外，其他目录正常处理
          include: pathsCfg.srcPath,
          exclude: [
            pathsCfg.componentPath,
            pathsCfg.entryPath,
            pathsCfg.viewPath
          ]
        }
      ]
    };
  };

  // 获取插件
  const getPlugins = () => {
    // HtmlWebpackPlugin 插件
    let htmlPlugins = [];
    pathsCfg.entryPages.forEach((entryPage) => {
      htmlPlugins.push(new HtmlWebpackPlugin({
        template: path.join(pathsCfg.pagePath, entryPage.template) + `?${encodeURIComponent(entryPage.title)}`, // 指定 html 模版路径
        filename: path.join(pathsCfg.portalPath, entryPage.name + pathsCfg.pageSuffix), // 指定 html 输出路径
        chunks: [].concat(Object.keys(extractBundle), entryPage.name), // 指定 html 中注入的资源
        hash: !!deployCfg.portalChunkHash, // 在资源文件后追加 webpack 编译哈希
        chunksSortMode: 'dependency', // 按照依赖顺序排序
        alwaysWriteToDisk: true, // 将内存文件写入磁盘
        minify: deployCfg.portalMinifyHtml ? { // 压缩 html 源码
          removeComments: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          minifyJS: true,
          minifyCSS: true
        } : undefined,
        alterAssetTags: (htmlPluginData) => { // 为插入的标签添加 crossorigin 属性，允许跨域脚本提供详细错误信息
          let assetTags = [].concat(htmlPluginData.head).concat(htmlPluginData.body);
          assetTags.forEach((assetTag) => {
            if (assetTag.tagName === 'script' || assetTag.tagName === 'link') {
              assetTag.attributes.crossorigin = 'anonymous';
            }
          });
          return htmlPluginData;
        },
        afterHtmlProcessing: (htmlPluginData) => { // 格式化 html 源码
          if (deployCfg.portalBeautifyHtml) {
            let newHtml = beautify.html(htmlPluginData.html, {
              indent_size: 2,
              preserve_newlines: false
            });
            htmlPluginData.html = newHtml;
          }
          return htmlPluginData;
        }
      }));
    });

    // PWA 相关插件
    let pwaPlugins = [];
    if (deployCfg.enablePwa) {
      pwaPlugins = [
        new WebpackPwaManifest(Object.assign({ // 需放置于 HtmlWebpackPlugin 之后
          name: pathsCfg.name,
          short_name: pathsCfg.name,
          description: pathsCfg.description,
          fingerprints: deployCfg.assetNameHash,
          start_url: `${publishCfg.publicPagePath}?_launcher=homescreen`,
          crossorigin: 'anonymous',
          display: 'minimal-ui', // IOS 中全屏需要自行处理后退操作
          orientation: 'portrait',
          theme_color: '#000',
          background_color: '#FFF',
          ios: true,
          includeDirectory: true,
          filename: 'pwa/app-manifest.[hash].json',
          icons: [{
            ios: true,
            sizes: [48, 96, 144, 192, 256, 512],
            destination: 'pwa',
            src: path.resolve(path.join(pathsCfg.imagePath, 'logo.png'))
          }]
        }, deployCfg.manifest)),
        new WorkboxPlugin.InjectManifest({
          swSrc: path.join(pathsCfg.sourcePath, 'sw.template.js'),
          swDest: path.join(pathsCfg.portalPath, pathsCfg.swName), // 与 html 文件文件保持一致
          importsDirectory: 'pwa',
          importWorkboxFrom: 'local', // 将 workbox 放在本地，否则需要访问谷歌 CDN
          precacheManifestFilename: 'precache-manifest.[manifestHash].js',
          exclude: [/\.map$/, /pwa[\\/]/]
        }),
        new WriteFileWebpackPlugin({ // 在 webpack-dev-server 环境中输出自定义 service-worker
          test: new RegExp(pathsCfg.swName)
        })
      ];
    }

    // 调试插件
    let debugPlugins = [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: path.join(__dirname, '../report.html')
      }),
      new webpack.debug.ProfilingPlugin({
        outputPath: path.join(__dirname, '../events.json')
      })
    ];

    // 入口页面对象
    let publicPageFullname = util.getPublicPageFullname(
      pathsCfg.entryPages, pathsCfg.pageSuffix, publishCfg.publicPagePath
    );

    return [].concat(
      // debugPlugins,
      happyPackPlugins,
      htmlPlugins,
      pwaPlugins,
      new HtmlWebpackEventPlugin(),
      new HtmlWebpackHarddiskPlugin(),
      new ForkTsCheckerWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: deployCfg.assetNameHash ? 'css/[name].[contenthash].css' : 'css/[name].css',
        chunkFilename: deployCfg.assetNameHash ? 'css/[name].[contenthash].css' : 'css/[name].css'
      }),
      new webpack.BannerPlugin({
        banner: `name: ${pathsCfg.name}\nversion: ${pathsCfg.version}\ndescription: ${pathsCfg.description}`
      }),
      new webpack.DefinePlugin(Object.assign({
        '__wd_define_env__': JSON.stringify(deployCfg._env),
        '__wd_define_ver__': JSON.stringify(pathsCfg.version),
        '__wd_public_page_path__': JSON.stringify(publishCfg.publicPagePath),
        '__wd_public_asset_path__': JSON.stringify(publishCfg.publicAssetPath),
        '__wd_public_rpc_path__': JSON.stringify(publishCfg.publicRpcPath),
        '__wd_public_page_fullname__': JSON.stringify(publicPageFullname),
        '__wd_service_worker_name__': JSON.stringify(deployCfg.enablePwa ? pathsCfg.swName : ''),
        '__wd_enable_web_push__': !!deployCfg.enablePush
      }, deployCfg._env === util.envEnum.dev ? undefined : {
        'process.env.NODE_ENV': JSON.stringify('production')
      }))
    );
  };

  return {
    entry: getEntries(),
    module: getModules(),
    plugins: getPlugins(),
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        commons: pathsCfg.commonPath,
        components: pathsCfg.componentPath,
        entries: pathsCfg.entryPath,
        images: pathsCfg.imagePath,
        libraries: pathsCfg.libraryPath,
        pages: pathsCfg.pagePath,
        sources: pathsCfg.sourcePath,
        states: pathsCfg.statesPath,
        styles: pathsCfg.stylePath,
        views: pathsCfg.viewPath
      }
    },
    output: {
      crossOriginLoading: 'anonymous',
      sourceMapFilename: 'map/[file].map',
      path: pathsCfg.assetPath,
      publicPath: publishCfg.publicAssetPath,
      pathinfo: undefined,
      filename: undefined,
      chunkFilename: undefined
    },
    optimization: {
      nodeEnv: false,
      noEmitOnErrors: true,
      runtimeChunk: getRuntimeChunk(),
      splitChunks: getSplitChunks(),
      minimize: undefined
    },
    mode: undefined,
    devtool: undefined,
    devServer: undefined
  };
};