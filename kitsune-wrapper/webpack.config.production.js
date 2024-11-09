const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const TerserPlugin = require("terser-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

/*============================================*/
/*  MUST ADD ENTRY HERE FOR EACH NEW MODULE   */
/*============================================*/
const moduleEntries = {
    index: {
        import: './index.ts',
        dependOn: ['wrapper']
    },
    wrapper: {
        import: './core/Wrapper.ts',
        dependOn: ['shared', 'kwl'],
    },
    kwl: {
        import: 'kitsune-wrapper-library',
        dependOn: ['shared']
    },
    lodash: 'lodash',
    shared: {
        import: ['inversify', 'reflect-metadata'],
        dependOn: ['lodash']
    }
};
module.exports = {
    mode: 'production',
    entry: moduleEntries,
    devtool: 'inline-source-map',
    watch: false,
    devServer: {
        open: true,
        static: '../public',
        host: 'localhost',
        https: true,
        port: 8080
    },
    externalsPresets: { node: true }, // in order to ignore built-in extensions like path, fs, etc.
    externals: [
    ], // in order to ignore all extensions in node_modules folder
    /*
    externals: [
            {
            lodash: {
                commonjs: 'lodash',
                amd: 'lodash',
                root: '_', // indicates global variable
            },
        }
    ]
    */
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    optimization: {
        minimize: true,
        minimizer: [
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            chunks: ['shared', 'kwl', 'index', 'wrapper', 'lodash'],
            inject: false
        }),
        new CopyPlugin({
            patterns: [
                { from: '../assets/logo.png', to: 'assets/logo.png' },
                { from: '../config/wrapper.json', to: 'config/wrapper.json' },
                { from: '../kitsune.ico', to: 'favicon.ico' },
            ],
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
        }),
        new NodePolyfillPlugin()
    ],
    output: {
        clean: true,
        publicPath: '',
        globalObject: 'this',
        filename: (pathData) => {
            switch (pathData.chunk.name) {
                case 'index':
                    return 'main.js';
                    break;
                case 'wrapper':
                    return 'wrapper.js';
                    break;
                case 'LowResOffScreenAnim':
                    return './LowResOffScreenAnim.js';
                case 'kwl':
                case 'shared':
                case 'lodash':
                    return 'modules/[name].bundle.js';
                    break;
                default:
                    return 'extensions/[name].bundle.js';
            }
        },
        path: path.resolve(__dirname, 'dist')
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    context: path.resolve(__dirname, './src/')
};
const packageMinified = () => {
    const entries = Object.keys(moduleEntries);
    const includedMinified = ['main.js'];
    entries.forEach((name) => {
        if (String(moduleEntries[name].import).includes('extensions/')|| name === 'shared' || name === 'kwl'|| name === 'wrapper' || name === 'lodash') {
            includedMinified.push(`modules/${name}.bundle.js`);
        }
    });
    const terserOptions = { include: includedMinified };
    module.exports.optimization.minimizer.push(new TerserPlugin(terserOptions));
};
packageMinified();
