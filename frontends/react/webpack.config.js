const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");
const prod = process.env.NODE_ENV === "production";

const serverDists = ["node", "go"];

const webpackConfigs = serverDists.map((dist) => {
    return {
        mode: prod ? "production" : "development",
        entry: "./src/index.tsx",
        output: {
            filename: "bundle.min.js",
            path: path.resolve(
                `${__dirname}/../../backends/servers/${dist}/dist`
            ),
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    resolve: {
                        extensions: [".ts", ".tsx", ".js", ".json"],
                    },
                    use: "ts-loader",
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader",
                        "postcss-loader",
                    ],
                },
            ],
        },
        devtool: prod ? undefined : "source-map",
        plugins: [
            new HtmlWebpackPlugin({
                template: "./public/index.html",
                minify: {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true,
                },
            }),
            new MiniCssExtractPlugin({
                filename: "styles.min.css",
            }),
        ],
    };
});

module.exports = webpackConfigs;
