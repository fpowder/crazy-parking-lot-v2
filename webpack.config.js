const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // entry: {
    //     index: {
    //         import: './src/index.js',
    //         dependOn: 'shared',
    //     },
    //     print: './src/print/print.js',
    //     another: {
    //         import: './src/another/another.js',
    //         dependOn: 'shared'
    //     },
    //     shared: 'lodash',
    // },
    entry: {
        index: './src/index.ts',
        print: './src/print/print.ts',
        another: './src/another/another.ts',
    },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/template/index.html',
            hash: true,
            excludeChunks: ['another'],
            filename: 'index.html'
        }),
        new HtmlWebpackPlugin({
            template: './src/template/another.html',
            hash: true,
            chunks: ['another'],
            filename: 'another.html'
        })
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        publicPath: '/dist'
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all'
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: '/node_modules/'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.js', '.ts']
    }
}