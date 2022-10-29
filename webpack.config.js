module.exports = {
    mode: "development",
    entry: "./src/main.ts",
    target: "node",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
                type: "asset/source",
            },
            {
                test: /\.mustache$/,
                type: "asset/source",
            }
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    experiments: {
        buildHttp: {
            allowedUris: [/githubassets\.com/],
            cacheLocation: false,
            upgrade: true
        }
    },
    output: {
        path: __dirname,
        filename: "index.js",
        libraryTarget: "commonjs",
    },
};
