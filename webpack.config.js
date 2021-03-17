const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: {
        index: './src/index.js',
        "background-script": './src/background-script.js',
        "content-script": './src/content-script.js'
    },
    target: "node",
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        globalObject: 'this'
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        host: '0.0.0.0',//your ip address
        port: 8080,
        disableHostCheck: true,
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
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "public" },
            ],
        }),
    ],
};