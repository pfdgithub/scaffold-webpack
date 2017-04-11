let path = require('path');
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let HtmlWebpackEventPlugin = require('html-webpack-event-plugin');
let HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
let AssetsWebpackPlugin = require('assets-webpack-plugin');

let defaults = require('./defaults');

// 提取公共依赖
let extractBundle = {
  reactBundle: ['react', 'react-dom'],
  commonBundle: [
    'commons/base', 'commons/util', 'commons/device', 'commons/config',
    'sources/db.global', 'sources/db.inner'
  ]
};

// 获取入口配置
let getEntries = () => {
  let entries = {};
  let pages = defaults.entryPages;

  // 根据入口页面获取入口脚本配置
  pages.forEach((page) => {
    entries[page] = [
      path.join(defaults.entryPath, page)
    ];
  });

  return Object.assign({}, extractBundle, entries);
};

// 获取加载器
let getModules = () => {
  // postcss 插件
  let postcssPlugins = () => {
    return [
      require('autoprefixer')
    ];
  };

  return {
    rules: [
      {
        enforce: "pre",
        test: /\.(js|jsx)$/,
        use: [
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
          {
            loader: 'html-loader',
            options: {
              interpolate: true,
              minimize: false,
              attrs: 'script:src link:href img:src a:href'
            }
          }
        ],
        include: defaults.srcPath
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: '[name]-[hash].[ext]'
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
              name: '[name]-[hash].[ext]'
            }
          }
        ],
        // 字体只能放在公共样式目录
        include: defaults.stylePath
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              name: '[name]-[hash]'
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
                plugins: postcssPlugins
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
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
                modules: true,
                localIdentName: '[name]-[local]-[hash:base64:5]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: postcssPlugins
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
                plugins: postcssPlugins
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
let getPlugins = () => {
  // html-webpack-plugin 插件
  let htmlPlugins = [];
  defaults.entryPages.forEach((entryPage) => {
    htmlPlugins.push(new HtmlWebpackPlugin({
      template: path.join(defaults.pagePath, entryPage + defaults.pageSuffix),
      filename: path.join(defaults.distPath, defaults.version, entryPage + defaults.pageSuffix),
      chunks: [].concat(Object.keys(extractBundle), entryPage),
      chunksSortMode: 'dependency',
      hash: false,
      inject: true,
      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: true,
      //   conservativeCollapse: true,
      //   minifyJS: true,
      //   minifyCSS: true
      // },
      alwaysWriteToDisk: true, // 将内存文件写入磁盘
      alterAssetTags: (htmlPluginData) => { // 为插入的标签添加 crossorigin 属性，允许跨域脚本提供详细错误信息。
        let assetTags = [].concat(htmlPluginData.head).concat(htmlPluginData.body);
        assetTags.forEach((assetTag) => {
          if (assetTag.tagName == 'script' || assetTag.tagName == 'link') {
            assetTag.attributes.crossorigin = 'anonymous';
          }
        });
        return htmlPluginData;
      }
    }));
  });

  return [].concat(
    htmlPlugins,
    new HtmlWebpackEventPlugin(),
    new HtmlWebpackHarddiskPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: Object.keys(extractBundle)
    }),
    new ExtractTextWebpackPlugin({
      filename: `${defaults.assetFilename}.css`,
      allChunks: false,
      disable: false
    }),
    new webpack.BannerPlugin({
      banner: `name: ${defaults.name}\nversion: ${defaults.version}\ndescription: ${defaults.description}\ntimestamp: ${defaults.timestamp}`
    }),
    new AssetsWebpackPlugin({
      path: path.join(defaults.distPath, defaults.version),
      filename: 'assets.json',
      prettyPrint: true,
      fullPath: true,
      metadata: {
        name: defaults.name,
        version: defaults.version,
        description: defaults.description,
        timestamp: defaults.timestamp
      }
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
      images: defaults.imagePath,
      libraries: defaults.libraryPath,
      sources: defaults.sourcePath,
      styles: defaults.stylePath,
      views: defaults.viewPath
    }
  },
  output: {
    filename: `${defaults.assetFilename}.js`,
    chunkFilename: `${defaults.assetFilename}.js`,
    path: path.join(defaults.distPath, defaults.version, defaults.assetDir),
    pathinfo: undefined,
    publicPath: undefined
  },
  cache: undefined,
  devtool: undefined,
  devServer: undefined
};