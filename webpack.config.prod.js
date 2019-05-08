const path = require('path');
const outputDir = path.join(__dirname, 'lib');

module.exports = {
  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    path: outputDir,
    filename: 'index.js',
    library: 'react-infinity-gauntlet-snap',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|gif|wav|mp3)$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: []
}