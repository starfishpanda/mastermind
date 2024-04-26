const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  entry: './src/client/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    publicPath: '/',
    filename: 'bundle.js',
    clean: true, // Automatically clean output directory on each build
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader',
        
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json', '.css', '.scss'] // Specifies which files webpack resolves so they can be imported without adding their extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/client/index.html'
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
  devtool: 'inline-source-map',
  // Live hot reloading for development
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist/client')
    },
    historyApiFallback: true,
    proxy: [{
      context: ['/api'],
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true,
      
    }]
  }
};
