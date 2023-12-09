module.exports = {
    mode: 'development',
    target: 'web',
    entry: './src/index.ts',

    output: {
        filename: 'index.js',
        path: `${__dirname}/public/built`,
        publicPath: '/built'
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
            {
                test: /\.scss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },

    devServer: {
        static: {
            directory: `${__dirname}/public`
        },
        port: 443,
        hot: true,
        watchFiles: ['src/*.ts', 'src/*.css', 'public/**/*'],
    },
    watch: false,
};