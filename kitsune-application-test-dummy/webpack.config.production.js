const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

/*============================================*/
/*  MUST ADD ENTRY HERE FOR EACH NEW MODULE   */
/*============================================*/
const moduleEntries = {
    application: {
        import: './index.ts'
    }
};
module.exports = {
    mode: 'production',
    entry: moduleEntries,
    devtool: 'inline-source-map',
    watch: false,
    devServer: {
        static: './dist',
    },
    externalsPresets: { node: false }, // in order to ignore built-in extensions like path, fs, etc.
    externals: [], // in order to ignore all extensions in node_modules folder
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
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
        })
    ],
    output: {
        clean: true,
        publicPath: '',
        filename: (pathData) => {
            switch (pathData.chunk.name) {
                case 'application':
                    return 'index.js';
                    break;
                default:
                    return '[name].bundle.js';
            }
        },
        path: path.resolve(__dirname, '../public/applications/test_dummy/')
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
    const includedMinified = ['index.js'];
    entries.forEach((name) => {
        if (String(moduleEntries[name].import).includes('extensions/')) {
            includedMinified.push(`../public/applications/test_dummy/index.js`);
        }
    });
    const terserOptions = { include: includedMinified };
    module.exports.optimization.minimizer.push(new TerserPlugin(terserOptions));
};
packageMinified();
