const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'development',
    entry:['babel-polyfill', './src/js/index.js'],
    output : {
        path : path.resolve(__dirname,'dist'),
        filename: 'js/bundle.js'
    },  
    devServer: {
        static: './dist',
        // contentBase
      },
      plugins: [
        new HtmlWebpackPlugin({
            filename:'index.html',
            template: './src/index.html'
        })
    ],
    module:{
        rules :[
            {
            test : /\.js$/,
            exclude : /node_module/,
            use: {
                loader: 'babel-loader'
                }
            }
            ]
    }   
}