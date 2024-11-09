const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CompressionPlugin = require("compression-webpack-plugin");
const {size} = require("lodash/collection");

/*============================================*/
/*  MUST ADD ENTRY HERE FOR EACH NEW MODULE   */
/*============================================*/
const moduleEntries = {
    index: {
        import: './index.ts'
    },
    helloWorldExtension: {
        import: ['./extensions/HelloWorldExtension.ts', 'hwrld']
    },
    pixiFrameworkExtension: {
        import: ['./extensions/PixiFrameworkExtension.ts', 'pixi.js']
    },
    threeFrameworkExtension: {
        import: ['./extensions/ThreeFrameworkExtension.ts', 'three']
    },
    dracoParser: {
        import: ['./extensions/DracoParser.ts'],
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
        mangleExports: 'size',
        mangleWasmImports: true,
        mergeDuplicateChunks: true,
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
                terserOptions: {
                    // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                    ecma: undefined,
                    parse: {},
                    compress: {},
                    mangle: true, // Note `mangle.properties` is `false` by default.
                    module: true,
                    // Deprecated
                    output: null,
                    format: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_classnames: true,
                    keep_fnames: false,
                    safari10: false,
                },
            }),
        ],
    },
    plugins: [
        new CompressionPlugin({
            algorithm: 'gzip',
            test: /.js$|.css$/,
        }),
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
                case 'index':
                    return 'index.js';
                    break;
                default:
                    return '../../kitsune-wrapper/dist/extensions/[name].bundle.js';
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
    const includedMinified = ['index.js'];
    entries.forEach((name) => {
        if (String(moduleEntries[name].import).includes('extensions/')) {
            includedMinified.push(`../../kitsune-wrapper/dist/extensions/${name}.bundle.js`);
        }
    });
    const terserOptions = { include: includedMinified };
    module.exports.optimization.minimizer.push(new TerserPlugin(terserOptions));
};
packageMinified();
