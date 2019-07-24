const webpack = require('webpack');
const fs = require('fs');

const pkg = JSON.parse(fs.readFileSync('./package.json'));

module.exports = {
    development: {
        mode: 'development',
        devtool: 'eval',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-proposal-class-properties']
                        }
                    }
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                __PROJECT__: JSON.stringify(pkg.name),
                __PROJECT_VERSION__: JSON.stringify(pkg.version),
                __DEBUG__: true
            })
        ]
    },

    production: {
        mode: 'production',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                            plugins: ['@babel/plugin-proposal-class-properties']
                        }
                    }
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                __PROJECT__: JSON.stringify(pkg.name),
                __PROJECT_VERSION__: JSON.stringify(pkg.version),
                __DEBUG__: false
            }),
        ]
    }
};

