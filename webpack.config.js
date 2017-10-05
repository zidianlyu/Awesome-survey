const path = require('path');

module.exports = {
    context: __dirname,
    entry: './frontend/root.jsx',
    output: {
        path: path.resolve('./asset/js'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: [/\.jsx?$/],
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react', 'stage-1']
                }
            }
        ]
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js', '.jsx', '*']
    }
};
