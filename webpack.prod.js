const path = require('path')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const {CleanWebpackPlugin} = require("clean-webpack-plugin")
const WorkboxPlugin = require('workbox-webpack-plugin')

module.exports = {
    entry: './src/client/index.js',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [ 'style-loader', 'css-loader', 'sass-loader']
            }, 
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['./js/build/*','./css/build/*']
          }),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true
        }),

    ]
}