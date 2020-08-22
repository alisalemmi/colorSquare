const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: './js/bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/pug/index.pug'
    }),
    new MiniCssExtractPlugin({
      filename: 'css/main.css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.pug$/,
        exclude: /node_modules/,
        loader: ['html-loader', 'pug-html-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
          process.env.NODE_ENV !== 'production'
            ? 'style-loader'
            : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../'
                }
              },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [autoprefixer()]
            }
          },
          'sass-loader',
          {
            loader: '@epegzz/sass-vars-loader',
            options: {
              syntax: 'scss',
              files: [path.resolve(__dirname, './src/config.json')]
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|svg|ttf|wav)$/i,
        loader: 'file-loader?name=[folder]/[name].[ext]'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss']
  }
};
