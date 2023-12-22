module.exports = {
    mode: "development",
    target: "web",
    entry: "./src/index.tsx",

    output: {
        filename: "index.js",
        path: `${__dirname}/public/built`,
        publicPath: "/built",
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
            },
            {
                test: /\.scss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
        ],
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
};
