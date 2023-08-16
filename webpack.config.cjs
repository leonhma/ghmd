const { join } = require('path');

module.exports = {
    mode: "development",
    entry: "./src/ghmd.ts",
    target: "node16",
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
        },
        outputModule: true
    },
    output: {
        path: join(__dirname, 'dist'),
        filename: "ghmd.js",
        library: {
            type: "module"
        }
    },
};
