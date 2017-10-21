const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: 'eval',
  //页面入口文件配置
  entry: [
    'webpack-dev-server/client?http://localhost:3001',
    'webpack/hot/only-dev-server',
    './demo/index.js'
  ],
  //入口文件输出配置
  output: {
    path: path.join(__dirname, 'demo', 'static'),
    filename: 'bundle.js',
    publicPath: '/demo/static/',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel'
      },
      {
        test: /\.css$/,
        loader: 'style!css?importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
      }, {
        test: /\.less$/,
        loader: 'style!css?modules&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]!postcss!less'
      }, {
        test: /\.(jpe?g|png|gif|eot|ttf|wav|mp3)$/,
        loader: 'file-loader?name=images/[hash:8].[name].[ext]',
      }
    ],
  },
  //其它解决方案配置
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  //插件项
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"development"', 'process.env.BROWSER': true }),
  ]
};