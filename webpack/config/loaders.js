const LOADERS = function (env) {
    let loaders = [{
        test: /\.(mp3|png|jpg|jpeg|svg)$/,
        use: [{
            loader: 'file-loader',
            options: {}
        }]
    }];
    if (env == 'dev') {
        loaders.push({
            test: /\.scss$/,
            use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]
        });
    }
    return loaders;
};

module.exports = LOADERS;