const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");


module.exports = {
    entry: {
        viz: './index.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            filename: "index.html",
        }),
        new HtmlWebpackPlugin({
            template: "./help.html",
            filename: "help.html",
        }),
        new HtmlWebpackPlugin({
            template: "./about.html",
            filename: "about.html",
        }),
        new MiniCssExtractPlugin({
                filename: "styles.css",
                chunkFilename: "[id].css"
        }),
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
        ],
        minimize: true,
    },
};