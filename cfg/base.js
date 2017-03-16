let fs = require('fs');
let path = require('path');
let webpack = require('webpack');
let HtmlWebpackEventPlugin = require('html-webpack-event-plugin');
let HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

let defaults = require('./defaults');
let postcssPlugins = () => { 
  return [
    require('autoprefixer')
  ];
};

// 获取入口配置
let getEntries = () => {
  let entries = {};
  let pages = defaults.entryPages;

  // 根据入口页面获取入口脚本配置
  pages.forEach(function (element/*, index, array*/) {
    entries[element] = [
      path.join(defaults.entryPath, element)
    ];
  });

  return entries;
};

// 获取加载器
let getModules = () => {
  return {
    rules: [
      {
        enforce: "pre",
        test: /\.(js|jsx)$/,
        use: {
          loader: 'eslint-loader',
          options: {
            cache: true
          }
        },
        include: defaults.srcPath
      },
      {
        test: /\.css$/,
        use: {
          loader: ExtractTextWebpackPlugin.extract({
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
        },
        include: defaults.srcPath
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        },
        include: defaults.srcPath
      },
      {
        test: /\.(ico|mp4|ogg|svg|eot|ttf|woff|woff2)$/,
        use: {
          loader: 'file-loader'
        },
        include: defaults.srcPath
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            interpolate: true,
            minimize: false,
            attrs: 'script:src link:href img:src a:href'
          }
        },
        include: defaults.srcPath
      },
      {
        test: /\.less$/,
        use: {
          loader: ExtractTextWebpackPlugin.extract({
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
          })
        },
        // 非指定目录正常处理
        exclude: [
          defaults.componentPath,
          defaults.viewPath,
          defaults.entryPath
        ]
      },
      {
        test: /\.less$/,
        use: {
          loader: ExtractTextWebpackPlugin.extract({
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
                  localIdentName: '[name]-[local]-[hash:base64:5]' // [path][name][local][hash:base64:5]
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
          })
        },
        // 指定目录启用 CSS Modules
        include: [
          defaults.componentPath,
          defaults.viewPath,
          defaults.entryPath
        ],
      }
    ]
  };
};

// 获取插件
let getPlugins = () => {
  return [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: Object.keys(defaults.extractBundle).push('manifest')
    }),
    new webpack.BannerPlugin({
      banner: 'Banner'
    }),
    // new webpack.LoaderOptionsPlugin({
    //   minimize: true,
    //   context: __dirname,
    //   debug: true
    // }),
    new HtmlWebpackEventPlugin(),
    new HtmlWebpackHarddiskPlugin(),
    new ExtractTextWebpackPlugin({
      filename: `${defaults.assetFilename}.css`, // [id][name][contenthash]
      allChunks: true,
      disable: false
    })
  ];
};

module.exports = {
  // externals: {
  //   'react': 'React',
  //   'react-dom': 'ReactDOM'
  // },
  // performance: {
  //   hints: "warning",
  //   maxEntrypointSize: 250000,
  //   maxAssetSize: 250000,
  //   assetFilter: (assetFilename) => {
  //     return !(/\.map$/.test(assetFilename))
  //   }
  // },

  debug: true,
  cache: true,
  devtool: 'eval',
  entry: Object.assign({}, defaults.extractBundle, getEntries()),
  module: getModules(),
  plugins: getPlugins(),
  resolve: {
    extensions: ['.jsx', '.js'],
    alias: {
      commons: path.join(defaults.srcPath, 'commons'),
      components: path.join(defaults.srcPath, 'components'),
      images: path.join(defaults.srcPath, 'images'),
      libraries: path.join(defaults.srcPath, 'libraries'),
      sources: path.join(defaults.srcPath, 'sources'),
      styles: path.join(defaults.srcPath, 'styles'),
      views: path.join(defaults.srcPath, 'views')
    }
  },
  output: {
    pathinfo: true,
    filename: `${defaults.assetFilename}.js`, // [name][hash][chunkhash]
    chunkFilename: `${defaults.assetFilename}.js`, // [id][name][hash][chunkhash]
    path: path.join(defaults.verDistPath, defaults.assetDir), // [hash]
    publicPath: undefined // 必须被具体环境配置所覆盖 [hash]
  },
  devServer: {
    port: defaults.port,
    inline: true, // there is no inline mode for WebpackDevServer API
    contentBase: defaults.srcPath,
    hot: true,
    compress: true,
    publicPath: undefined, // 必须被具体环境配置所覆盖 output.publicPath
    stats: {
      chunkModules: false,
      children: false,
      errorDetails: true,
      colors: true
    },
    https: defaults.https ? {
      key: fs.readFileSync(path.join(__dirname, './cert/key.pem'), 'utf8'),
      cert: fs.readFileSync(path.join(__dirname, './cert/cert.pem'), 'utf8'),
      cacert: fs.readFileSync(path.join(__dirname, './cert/cert.pem'), 'utf8')
    } : undefined
  }
};