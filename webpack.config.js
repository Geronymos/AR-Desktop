const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        globalObject: 'this'
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, 'public')
    },
    module: {
        rules: [
            {
                // https://github.com/burnpiro/erdem.pl/blob/master/gatsby-node.js
                test: /\.worker\.js$/,
                use: { loader: 'workerize-loader' }
            },
            {
                // https://github.com/tensorflow/tfjs/tree/master/tfjs-backend-wasm/starter/webpack
                test: /\.wasm$/i,
                type: 'javascript/auto',
                use: [
                  {
                    loader: 'file-loader',
                  },
                ],
              },
        ]
    }
};