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
const HappyPack = require('happypack');

const defaults = require('./defaults');
const deployCfg = defaults.deployCfg || {};

// 提取公共依赖
const extractBundle = {
  runtime: undefined, // webpackBootstrap
  commonBundle: [
    'react', 'react-dom',
    'commons/base', 'commons/util', 'commons/config',
    'sources/db.global', 'sources/db.inner'
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
  defaults.entryPages.forEach((entryPage) => {
    entries[entryPage.name] = [
      path.join(defaults.entryPath, entryPage.name)
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
    loader: 'style-loader'
  };

  return {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        use: [
          cacheLoader,
          {
            loader: 'eslint-loader',
            options: {
              cache: true
            }
          }
        ],
        include: defaults.srcPath
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          cacheLoader,
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ],
        include: defaults.srcPath
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
        include: defaults.srcPath
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
        include: defaults.srcPath
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
        include: defaults.stylePath
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
        include: defaults.srcPath,
        exclude: defaults.stylePath
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
              sourceMap: true
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
              sourceMap: true
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
              modifyVars: defaults.antdModify.lessVars
            }
          }
        ],
        // 覆盖 antd 目录的 less 变量
        include: defaults.antdModify.antdPath
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
              modules: true,
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
          defaults.componentPath,
          defaults.entryPath,
          defaults.viewPath
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
              sourceMap: true
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
        include: defaults.srcPath,
        exclude: [
          defaults.componentPath,
          defaults.entryPath,
          defaults.viewPath
        ]
      }
    ]
  };
};

// 获取插件
const getPlugins = () => {
  // HtmlWebpackPlugin 插件
  let htmlPlugins = [];
  defaults.entryPages.forEach((entryPage) => {
    htmlPlugins.push(new HtmlWebpackPlugin({
      title: entryPage.title,
      template: path.join(defaults.pagePath, entryPage.template), // 指定 html 模版路径
      filename: path.join(defaults.portalPath, entryPage.name + defaults.pageSuffix), // 指定 html 输出路径
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
    // 从资源到页面的 url 相对路径
    let assetToportal = path.relative(defaults.assetPath, defaults.portalPath);
    assetToportal = assetToportal.split('\\').join('/');

    pwaPlugins = [
      new WebpackPwaManifest(Object.assign({ // 需放置于 HtmlWebpackPlugin 之后
        name: defaults.name,
        short_name: defaults.name,
        description: defaults.description,
        fingerprints: deployCfg.assetNameHash,
        start_url: `${assetToportal}/../index.html?_launcher=homescreen`,
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#3DB1FA',
        background_color: '#FFF',
        ios: true,
        includeDirectory: true,
        filename: 'pwa/app-manifest.[hash].json',
        icons: [{
          ios: true,
          sizes: [512],
          destination: 'pwa',
          src: path.resolve(path.join(defaults.imagePath, 'logo.png'))
        }]
      }, deployCfg.manifest)),
      new WorkboxPlugin.InjectManifest({
        swSrc: path.join(defaults.sourcePath, 'sw.template.js'),
        swDest: path.join(defaults.portalPath, defaults.swName),
        importsDirectory: 'pwa',
        importWorkboxFrom: 'local', // 将 workbox 放在本地，否则需要访问谷歌 CDN
        precacheManifestFilename: 'precache-manifest.[manifestHash].js',
        // 默认包含 webpack 中的全部资源，但由于直接使用 Asset 字符串拼接资源 url
        // 造成部分资源路径错误无法正确加载，如 /assets/..\\index.html /assets/pwa\app-manifest.json
        exclude: [/\.map$/, /\.html$/, /pwa[\\/]/],
        // 添加 webpack 之外的资源，使用此方式添加正确的资源 url（相对路径），如 index.html
        // globDirectory: defaults.portalPath,
        // globPatterns: ['**/*.html']
      }),
      new WriteFileWebpackPlugin({ // 在 webpack-dev-server 环境中输出自定义 service-worker
        test: new RegExp(defaults.swName)
      })
    ];
  }

  return [].concat(
    happyPackPlugins,
    htmlPlugins,
    pwaPlugins,
    new HtmlWebpackEventPlugin(),
    new HtmlWebpackHarddiskPlugin(),
    new MiniCssExtractPlugin({
      filename: deployCfg.assetNameHash ? 'css/[name]-[contenthash].css' : 'css/[name].css',
      chunkFilename: deployCfg.assetNameHash ? 'css/[name]-[contenthash].css' : 'css/[name].css'
    }),
    new webpack.BannerPlugin({
      banner: `name: ${defaults.name}\nversion: ${defaults.version}\ndescription: ${defaults.description}`
    })
  );
};

module.exports = {
  entry: getEntries(),
  module: getModules(),
  plugins: getPlugins(),
  resolve: {
    extensions: ['.jsx', '.js'],
    alias: {
      commons: defaults.commonPath,
      components: defaults.componentPath,
      entries: defaults.entryPath,
      images: defaults.imagePath,
      libraries: defaults.libraryPath,
      pages: defaults.pagePath,
      sources: defaults.sourcePath,
      styles: defaults.stylePath,
      views: defaults.viewPath
    }
  },
  output: {
    crossOriginLoading: 'anonymous',
    sourceMapFilename: 'map/[file].map',
    path: defaults.assetPath,
    filename: undefined,
    chunkFilename: undefined,
    pathinfo: undefined,
    publicPath: undefined
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