const path = require('path');
module.exports = {
  entry: {
    index: path.resolve('dist', "cjs", 'index.js')
  },
  mode: 'production',
  output: {
    path: path.resolve('dist', "umd"),
    filename: "[name].js",
    library: {
      type: 'umd',
      name: 'ClassTransformer',
    }
  },
  module: {
    rules: [
      {
        test: /\.m?jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      }
    ]
  },
  externals: {
    "@geckoai/class-mirror": "ClassMirror",
    "validator": "Validator"
  },
  target: ["web", "es5"]
};
