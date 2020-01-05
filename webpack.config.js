const path = require("path");
const webpack = require("webpack");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: ["./src/main.ts"]
    },
    mode: "development",
    watch: true,

    devServer: {
        publicPath: "/",
        contentBase: "./",
        hot: true,
        watchContentBase: true,
        compress: false,
        port: 4201,
        writeToDisk: true
    },

    watchOptions: {
        ignored: ["node_modules"],
        poll: 1000
    },

    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "main.js"
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        plugins: [
            new TsconfigPathsPlugin({configFile: "tsconfig.json"})
        ]
    },

    module: {
        rules: [
            {
                test: /\.(tsx?)|(js)$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            },
            { // For shaders
                test: [/\.vert$/, /\.frag$/],
                use: 'raw-loader'
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            CANVAS_RENDERER: JSON.stringify(true),
            WEBGL_RENDERER: JSON.stringify(true)
        }),
        new webpack.NamedModulesPlugin(),
        new CopyWebpackPlugin([
            {
                //Note:- No wildcard is specified hence will copy all files and folders
                from: 'src/scripts', //Will resolve to RepoDir/src/assets
                to: './' //Copies all files from above dest to dist/assets
            },
            {
                //Wildcard is specified hence will copy only css files
                from: 'src/css/*.css', //Will resolve to RepoDir/src/css and all *.css files from this directory
                to: 'css'//Copies all matched css files from above dest to dist/css
            }
        ])
    ]
};
