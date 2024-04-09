const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");
const isProd = process.env.NODE_ENV;
const distServer = process.env.DIST_SERVER;

module.exports = {
    mode: isProd ? "production" : "development",
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.min.js",
        path: distServer
            ? path.resolve(
                  `${__dirname}/../../backends/servers/${distServer}/dist`
              )
            : path.resolve(__dirname, "dist"),
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
    devtool: isProd ? undefined : "source-map",
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
