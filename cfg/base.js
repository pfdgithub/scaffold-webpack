const path = require('path');
const webpack = require('webpack');
const beautify = require('js-beautify');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackEventPlugin = require('html-webpack-event-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const HappyPack = require('happypack');

const defaults = require('./defaults');
const deployCfg = defaults.deployCfg || {};

// 提取公共依赖
const extractBundle = {
  reactBundle: ['react', 'react-dom'],
  commonBundle: [
    'commons/base', 'commons/util', 'commons/config',
    'sources/db.global', 'sources/db.inner'
  ].concat(deployCfg.enablePwa ? ['sources/sw.boot'] : []),
  runtime: undefined // webpackBootstrap
};

// HappyPack 插件
const happyPackPlugins = [];
const createHappyPlugin = (id, loaders) => {
  happyPackPlugins.push(new HappyPack({
    id: id,
    loaders: loaders
  }));

  return `happypack/loader?id=${id}`
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

  // 排除无效入口
  let validBundle = {};
  for (let key in extractBundle) {
    let val = extractBundle[key];
    if (val && val.length > 0) {
      validBundle[key] = val;
    }
  }

  return Object.assign({}, validBundle, entries);
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
              name: '[name].[hash].[ext]'
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
              name: '[name].[hash].[ext]'
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
              name: '[name].[hash]'
            }
          }
        ],
        // 除公共样式目录外，其他目录使用 svg-sprite
        include: defaults.srcPath,
        exclude: defaults.stylePath
      },
      {
        test: /\.css$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: {
            loader: 'style-loader'
          },
          use: [
            cacheLoader,
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
        })
        // 不限制目录（包含 node_modules 目录）
      },
      {
        test: /\.less$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: {
            loader: 'style-loader'
          },
          use: [
            cacheLoader,
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
          ]
        }),
        // 业务组件、入口脚本、单页视图，启用 CSS Modules
        include: [
          defaults.componentPath,
          defaults.entryPath,
          defaults.viewPath
        ]
      },
      {
        test: /\.less$/,
        use: ExtractTextWebpackPlugin.extract({
          fallback: {
            loader: 'style-loader'
          },
          use: [
            cacheLoader,
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
          ]
        }),
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
    let resourceQuery = {
      title: entryPage.title
    };

    htmlPlugins.push(new HtmlWebpackPlugin({
      favicon: path.join(defaults.imagePath, 'favicon.ico'),
      template: path.join(defaults.pagePath, entryPage.template) + `?${JSON.stringify(resourceQuery)}`, // 指定 html 模版路径
      filename: path.join(defaults.portalPath, entryPage.name + defaults.pageSuffix), // 指定 html 输出路径
      chunks: [].concat(Object.keys(extractBundle), entryPage.name), // 指定 html 中注入的资源。
      chunksSortMode: 'dependency', // 按照依赖顺序排序
      hash: false, // 在资源文件后追加 webpack 编译哈希
      inject: true, // 将 js 文件注入 body 底部
      alwaysWriteToDisk: true, // 将内存文件写入磁盘
      minify: deployCfg.portalMinifyHtml ? { // 压缩 html 源码
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        minifyJS: true,
        minifyCSS: true
      } : undefined,
      alterAssetTags: (htmlPluginData) => { // 为插入的标签添加 crossorigin 属性，允许跨域脚本提供详细错误信息。
        let assetTags = [].concat(htmlPluginData.head).concat(htmlPluginData.body);
        assetTags.forEach((assetTag) => {
          if (assetTag.tagName == 'script' || assetTag.tagName == 'link') {
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
      new CopyWebpackPlugin([{ // Service Worker 需要的文件，不能用 webpack 处理
        from: require.resolve('workbox-sw'),
        to: path.join(defaults.portalPath, 'workbox-sw.js')
      }]),
      new WriteFileWebpackPlugin({ // 输出 CopyWebpackPlugin 复制的文件
        test: /workbox-sw.js/
      }),
      new WorkboxPlugin({ // 预加载 webpack 输出文件
        globPatterns: ['**/*'],
        globIgnores: ['**/*.map', 'sw.js', 'workbox-sw.js'],
        globDirectory: defaults.portalPath,
        swSrc: path.join(defaults.sourcePath, 'sw.template.js'),
        swDest: path.join(defaults.portalPath, 'sw.js')
      }),
      new WebpackPwaManifest(Object.assign({ // 需放置于 HtmlWebpackPlugin 之后
        name: defaults.name,
        short_name: defaults.name,
        description: defaults.description,
        fingerprints: deployCfg.assetNameHash,
        start_url: 'index.html',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#3DB1FA',
        background_color: '#FFF',
        ios: true,
        icons: [{
          ios: true,
          sizes: [48, 96, 144, 192],
          src: path.resolve(path.join(defaults.imagePath, 'logo.png'))
        }]
      }, deployCfg.manifest))
    ]
  }

  return [].concat(
    happyPackPlugins,
    htmlPlugins,
    pwaPlugins,
    new HtmlWebpackEventPlugin(),
    new HtmlWebpackHarddiskPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedChunksPlugin((chunk) => {
      if (chunk.name) {
        return chunk.name;
      }
      return chunk.mapModules(m => path.relative(m.context, m.resource)).join('_');
    }),
    new webpack.optimize.CommonsChunkPlugin({
      minChunks: Infinity,
      names: Object.keys(extractBundle)
    }),
    new ExtractTextWebpackPlugin({
      allChunks: true, // 打包在异步模块中的依赖样式，会因丢失依赖项而在加载时抛出异常。
      disable: !deployCfg.assetExtractCss,
      filename: deployCfg.assetNameHash ? '[name]-[contenthash].css' : '[name].css'
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
      mocks: defaults.mockPath,
      pages: defaults.pagePath,
      sources: defaults.sourcePath,
      styles: defaults.stylePath,
      views: defaults.viewPath
    }
  },
  output: {
    crossOriginLoading: 'anonymous',
    filename: `[name].js`,
    chunkFilename: `[name].js`,
    path: defaults.assetPath,
    pathinfo: undefined,
    publicPath: undefined
  },
  cache: undefined,
  devtool: undefined,
  devServer: undefined
};