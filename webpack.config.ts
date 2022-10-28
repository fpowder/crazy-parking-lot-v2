import path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const config: webpack.Configuration = {
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
        // index: './src/index.ts',
        crazyParkingLot: './src/crazyParkingLot.ts'
    },
    devtool: 'inline-source-map',
    plugins: [
        // new HtmlWebpackPlugin({
        //     template: './src/template/index.html',
        //     hash: true,
        //     excludeChunks: ['crazyParkingLot'],
        //     filename: 'index.html'
        // }),
        new HtmlWebpackPlugin({
            template: './src/template/crazyParkingLot.html',
            hash: false,
            // chunks: ['crazyParkingLot'],
            // excludeChunks: ['index'],
            filename: 'crazyParkingLot.html'
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
    },
    mode: 'development'
}

export default config;