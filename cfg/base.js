let path = require('path');
let webpack = require('webpack');
let Autoprefixer = require('autoprefixer');
let HtmlWebpackEventPlugin = require('html-webpack-event-plugin');
let HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
let ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

let defaults = require('./defaults');

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
    // noParse: false,
    // unknownContextRequest: '.',
    // unknownContextRecursive: true,
    // unknownContextRegExp: /^\.\/.*$/,
    // unknownContextCritical: true,
    // exprContextRequest: '.',
    // exprContextRegExp: /^\.\/.*$/,
    // exprContextRecursive: true,
    // exprContextCritical: true,
    // wrappedContextRegExp: /.*/,
    // wrappedContextRecursive: true,
    // wrappedContextCritical: false,
    // postLoaders: [
    //   {
    //     test: '',
    //     loader: '',
    //     loaders: [],
    //     exclude: [],
    //     include: []
    //   }
    // ],

    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader?cache',
        include: defaults.srcPath
      }
    ],
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextWebpackPlugin.extract('style-loader', 'css-loader!postcss-loader')
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.(ico|mp4|ogg|svg|eot|ttf|woff|woff2)$/,
        loader: 'file-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader?interpolate&minimize=false&attrs=script:src link:href img:src a:href'
      },
      {
        test: /\.less$/,
        // 非指定目录正常处理
        exclude: [
          defaults.componentPath,
          defaults.viewPath,
          defaults.entryPath
        ],
        loader: ExtractTextWebpackPlugin.extract('style-loader', 'css-loader!postcss-loader!less-loader')
      },
      {
        test: /\.less$/,
        // 指定目录启用 CSS Modules
        include: [
          defaults.componentPath,
          defaults.viewPath,
          defaults.entryPath
        ],
        loader: ExtractTextWebpackPlugin.extract('style-loader', 'css-loader?modules&localIdentName=[name]-[local]-[hash:base64:5]!postcss-loader!less-loader') // [path][name][local][hash:base64:5]
      }
    ]
  };
};

// 获取插件
let getPlugins = () => {
  return [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: Object.keys(defaults.extractBundle)
    }),
    new HtmlWebpackEventPlugin(),
    new HtmlWebpackHarddiskPlugin(),
    new ExtractTextWebpackPlugin(`${defaults.assetFilename}.css`, {
      allChunks: true,
      disable: false
    })
  ];
};

module.exports = {
  // context: process.cwd(),
  // target: 'web',
  // bail: false,
  // profile: false,
  // recordsPath: path.join(__dirname, '../compilerState.json'),
  // recordsInputPath: path.join(__dirname, '../compilerState.json'),
  // recordsOutputPath: path.join(__dirname, '../compilerState.json'),
  // amd: {},
  // loader: {},
  // node: {
  //   console: false,
  //   global: true,
  //   process: true,
  //   Buffer: true,
  //   __filename: 'mock',
  //   __dirname: 'mock',
  //   setImmediate: true
  // },
  // resolveLoader: {
  //   moduleTemplates: ['*-webpack-loader', '*-web-loader', '*-loader', '*'],
  //   modulesDirectories: ['web_loaders', 'web_modules', 'node_loaders', 'node_modules'],
  //   extensions: ['', '.webpack-loader.js', '.web-loader.js', '.loader.js', '.js'],
  //   packageMains: ['webpackLoader', 'webLoader', 'loader', 'main']
  // },
  // externals: {
  //   'react': 'React',
  //   'react-dom': 'ReactDOM'
  // },

  debug: true,
  cache: true,
  devtool: 'eval',
  entry: Object.assign({}, defaults.extractBundle, getEntries()),
  module: getModules(),
  plugins: getPlugins(),
  resolve: {
    // root: [path.join(__dirname, '..')],
    // modulesDirectories: ['node_modules'],
    // fallback: [path.join(__dirname, '..')],
    // packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main'],
    // packageAlias: '',
    // unsafeCache: [],

    extensions: ['', '.jsx', '.js'],
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
    // crossOriginLoading: 'anonymous',
    // sourceMapFilename: '[file].map', // [file][id][hash]
    // devtoolModuleFilenameTemplate: 'webpack:///[resource-path]', // [resource][resource-path][loaders][all-loaders][id][hash][absolute-resource-path]
    // devtoolFallbackModuleFilenameTemplate: 'webpack:///[resource-path]', // [resource][resource-path][loaders][all-loaders][id][hash][absolute-resource-path]
    // devtoolLineToLine: false,
    // hotUpdateChunkFilename: '[id].[hash].hot-update.js', //[id][hash]
    // hotUpdateMainFilename: '[hash].hot-update.json', // [hash]
    // jsonpFunction: 'webpackJsonp',
    // hotUpdateFunction: 'webpackHotUpdate',
    // library: 'libraryName',
    // libraryTarget: 'var', // var this commonjs commonjs2 amd umd
    // umdNamedDefine: true,
    // sourcePrefix: '\t',
    // crossOriginLoading: false, // false anonymous use-credentials

    pathinfo: true,
    filename: `${defaults.assetFilename}.js`, // [name][hash][chunkhash]
    chunkFilename: `${defaults.assetFilename}.js`, // [id][name][hash][chunkhash]
    path: path.join(defaults.verDistPath, defaults.assetDir), // [hash]
    publicPath: undefined // 必须被具体环境配置所覆盖 [hash]
  },
  devServer: {
    port: defaults.port,
    inline: true, // there is no inline mode for WebpackDevServer API

    /* webpack-dev-server options */

    // historyApiFallback: false,
    // proxy: {},
    // setup: () => {},
    // staticOptions: {},
    // clientLogLevel: 'info', // error warning info none
    contentBase: defaults.srcPath,
    hot: true,
    compress: true,

    /* webpack-dev-middleware options */

    // noInfo: false,
    // quiet: false,
    // lazy: true,
    // filename: '[name].js', // output.filename
    // index: "index.html",
    // reporter: null,
    // serverSideRender: false,
    // watchOptions: {
    //   aggregateTimeout: 300,
    //   poll: undefined
    // },
    // headers: {},

    stats: {
      chunkModules: false,
      children: false,
      errorDetails: true,
      colors: true
    },
    publicPath: undefined // 必须被具体环境配置所覆盖 output.publicPath
  },
  postcss: function () {
    return [Autoprefixer];
  }
};