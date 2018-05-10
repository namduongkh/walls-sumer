const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const glob = require("glob")
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const PATHS = require('./config/path');
const ENTRIES = require('./config/entries');
const LOADERS = require('./config/loaders');

module.exports = (env, debug) => {
    return {
        mode: env == "dev" || debug ? 'development' : 'production',
        entry: ENTRIES(env),
        module: {
            rules: LOADERS(env)
        },
        plugins: [
            new CleanWebpackPlugin([PATHS.dist, PATHS.build]),
            new HtmlWebpackPlugin({
                title: 'Creative Game Prototype',
                template: PATHS.debugTemplates
            }),
            new webpack.NamedModulesPlugin(),
            new BrowserSyncPlugin({
                host: 'localhost',
                port: 3000,
                server: { baseDir: [PATHS.dist] }
            }),
        ],
        output: {
            filename: env == "dev" ? 'bundle.js' : 'bundle.min.js',
            path: env == "dev" ? PATHS.dist : PATHS.build,
        }
    };
};