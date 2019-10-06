/*eslint-env node*/
const autoprefixer = require('autoprefixer');

const {AngularCompilerPlugin} = require('@ngtools/webpack');
const _ = require('lodash');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = function makeWebpackConfig(options) {
    /**
     * Environment type
     * BUILD is for generating minified builds
     * TEST is for generating test builds
     */
    const BUILD = !!options.BUILD;
    const TEST = !!options.TEST;
    const DEV = !!options.DEV;

    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    const config = {};

    config.mode = BUILD
        ? 'production'
        : 'development';

    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     * Should be an empty object if it's generating a test build
     * Karma will set this when it's a test build
     */
    if(TEST) {
        config.entry = undefined;
    } else {
        config.entry = {
            polyfills: './client/app/polyfills.ts',
            app: './client/app/index.ts',
        };
    }

    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     * Should be an empty object if it's generating a test build
     * Karma will handle setting it up for you when it's a test build
     */
    if(TEST) {
        config.output = {};
    } else {
        config.output = {
            // Absolute output directory
            path: BUILD ? path.join(__dirname, '/dist/client/') : path.join(__dirname, '/.tmp/'),

            // Output path from the view of the page
            // Uses webpack-dev-server in development
            publicPath: BUILD || DEV ? '/' : `http://localhost:${8080}/`,
            //publicPath: BUILD ? '/' : 'http://localhost:' + env.port + '/',

            // Filename for entry points
            // Only adds hash in build mode
            filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',

            // Filename for non-entry points
            // Only adds hash in build mode
            chunkFilename: BUILD ? '[name].[hash].js' : '[name].bundle.js'
        };
    }

    config.resolve = {
        modules: ['node_modules'],
        extensions: ['.js', '.ts'],
        alias: {
            primus: !TEST ? path.resolve(__dirname, 'client/components/socket/primus.js')
                : path.resolve(__dirname, 'client/components/socket/primus.mock.js'),
        }
    };

    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    if(TEST) {
        config.devtool = 'inline-source-map';
    } else if(BUILD) {
        config.devtool = 'source-map';
    } else if(DEV) {
        config.devtool = 'eval-source-map';
    } else {
        config.devtool = 'eval';
    }

    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */

    // const POSTCSS_LOADER = {
    //     loader: 'postcss-loader',
    //     options: {
    //         ident: 'postcss',
    //         sourceMap: true,
    //         config: {
    //             plugins: [
    //                 // require('cssnano')(),
    //             ],
    //             //         ctx: {
    //             //             'postcss-preset-env': {
    //             //                 browsers: 'last 2 version',
    //             //             },
    //             //             cssnano: {},
    //             //         },
    //         },
    //     }
    // };
    const POSTCSS_LOADER = 'postcss-loader';

    // Initialize module
    config.module = {
        rules: [{
            test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
            use: '@ngtools/webpack',
        // }, {
        //     JS LOADER
        //     Reference: https://github.com/babel/babel-loader
        //     Transpile .js files using babel-loader
        //     Compiles ES6 and ES7 into ES5 code
        //     test: /(?!(\.ngfactory|\.ngstyle))\.js$/,
        //     use: {
        //         loader: 'babel-loader',
        //         options: {
        //             babelrc: false,
        //             presets: [
        //                 ['babel-preset-env', {
        //                     // debug: true,
        //                     targets: {
        //                         browsers: ['last 2 versions', 'not dead'],
        //                     },
        //                     debug: true,
        //                     modules: false,
        //                 }],
        //             ],
        //             plugins: [
        //                 'transform-runtime',
        //                 'transform-decorators-legacy',
        //                 'transform-class-properties',
        //                 'transform-export-extensions',
        //             ].concat(TEST ? ['istanbul'] : []),
        //             shouldPrintComment(commentContents) {
        //                 let regex = DEV
        //                     // keep `// @flow`, `/*@ngInject*/`, & flow type comments in dev
        //                     ? /(@flow|@ngInject|^:)/
        //                     // keep `/*@ngInject*/`
        //                     : /@ngInject/;
        //                 return regex.test(commentContents);
        //             }
        //         },
        //     },
        //     include: [
        //         path.resolve(__dirname, 'client/'),
        //         path.resolve(__dirname, 'server/config/environment/shared.js'),
        //         path.resolve(__dirname, 'node_modules/lodash-es/')
        //     ]
        }, {
        //     // TS LOADER
        //     // Reference: https://github.com/s-panferov/awesome-typescript-loader
        //     // Transpile .ts files using awesome-typescript-loader
        //     test: /\.ts$/,
        //     use: [{
        //         loader: 'awesome-typescript-loader',
        //         options: {
        //             tsconfig: path.resolve(__dirname, 'tsconfig.json')
        //         },
        //     }, 'angular2-template-loader'].concat(DEV ? '@angularclass/hmr-loader' : []),
        //     include: [
        //         path.resolve(__dirname, 'client/')
        //     ]
        // }, {
            // ASSET LOADER
            // Reference: https://github.com/webpack/file-loader
            // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
            // Rename the file using the asset hash
            // Pass along the updated reference to your code
            // You can add here any file extension you want to get copied to your output
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
            use: 'file-loader'
        }, {
            // HTML LOADER
            // Reference: https://github.com/webpack/raw-loader
            // Allow loading html through js
            test: /\.html$/,
            use: 'raw-loader'
        }, {
            // CSS LOADER
            // Reference: https://github.com/webpack/css-loader
            // Allow loading css through js
            //
            // Reference: https://github.com/postcss/postcss-loader
            // Postprocess your css with PostCSS plugins
            test: /\.css$/,
            use: [
                DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
                { loader: 'css-loader', options: { importLoaders: 1 } },
                POSTCSS_LOADER,
            ],
            include: [
                path.resolve(__dirname, 'client/app/app.css')
            ]
        }, {
            // SASS LOADER
            // Reference: https://github.com/jtangelder/sass-loader
            test: /\.(scss|sass)$/,
            use: [
                DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
                { loader: 'css-loader', options: { importLoaders: 1, sourceMap: true, } },
                POSTCSS_LOADER,
                'sass-loader',
            ],
            include: [
                path.resolve(__dirname, 'node_modules/angular-material/angular-material.scss'),
                path.resolve(__dirname, 'client/app/app.scss')
            ]
        }, {
            // SASS LOADER
            // Reference: https://github.com/jtangelder/sass-loader
            test: /\.(scss|sass)$/,
            use: [
                'to-string-loader?sourceMap',
                { loader: 'css-loader', options: { importLoaders: 1, sourceMap: true, } },
                POSTCSS_LOADER,
                'sass-loader?sourceMap',
            ],
            include: [
                path.resolve(__dirname, 'client')
            ],
            exclude: [/app\.scss$/]
        }, {
            test: /photoswipe.*\.js$/,
            use: 'imports-loader?define=>false&this=>window'
        }]
    };

    // ISPARTA INSTRUMENTER LOADER
    // Reference: https://github.com/ColCh/isparta-instrumenter-loader
    // Instrument JS files with Isparta for subsequent code coverage reporting
    // Skips node_modules and spec files
    if(TEST) {
        config.module.rules.push({
            enforce: 'pre',
            //delays coverage til after tests are run, fixing transpiled source coverage error
            test: /\.js$/,
            exclude: /(node_modules|spec\.js|mock\.js)/,
            use: 'isparta-loader'
        });
    }

    // CSS LOADER
    // Reference: https://github.com/webpack/css-loader
    // Allow loading css through js
    //
    // Reference: https://github.com/postcss/postcss-loader
    // Postprocess your css with PostCSS plugins
    // const cssLoader = {
    //     test: /\.css$/,
    //     // Reference: https://github.com/webpack/extract-text-webpack-plugin
    //     // Extract css files in production builds
    //     //
    //     // Reference: https://github.com/webpack/style-loader
    //     // Use style-loader in development for hot-loading
    //     use: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader?sourceMap!postcss-loader'})
    // };
    //
    // // Skip loading css in test mode
    // if(TEST) {
    //     // Reference: https://github.com/webpack/null-loader
    //     // Return an empty module
    //     cssLoader.use = 'null-loader';
    // }

    // Add cssLoader to the loader list
    // config.module.rules.push(cssLoader);

    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),

        // Hides the 'the request of a dependency is an expression' warnings
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core/,
            path.resolve(__dirname, '../src')
        ),

        new webpack.LoaderOptionsPlugin({
            options: {
                context: __dirname
            },
            /**
             * PostCSS
             * Reference: https://github.com/postcss/autoprefixer-core
             * Add vendor prefixes to your css
             */
            postcss: [
                autoprefixer()
            ],
            sassLoader: {
                outputStyle: 'compressed',
                precision: 10,
                sourceComments: false
            },
            isparta: {
                embedSource: true,
                noAutoWrap: true,
            }
        }),

        new AngularCompilerPlugin({
            tsConfigPath: './tsconfig.json',
            entryModule: './client/app/app.module#AppModule',
            sourceMap: true,
        }),

        // new HardSourceWebpackPlugin(),
    ];

    if(DEV) {
        config.plugins.push(
            new webpack.HotModuleReplacementPlugin(),
        );
    }

    if(BUILD) {
        config.plugins.push(
            new CompressionPlugin({}),
            // https://github.com/webpack-contrib/mini-css-extract-plugin
            new MiniCssExtractPlugin({
                filename: '[name].[hash].css',
                chunkFilename: '[id].[hash].css',
            }),
            new CopyPlugin([
                { from: 'client/shared.js', to: 'shared.js' },
                { from: 'client/favicon.ico', to: 'favicon.ico' },
                { from: 'client/assets/images', to: 'assets/images' },
            ]),
        );
        config.optimization = {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        name: 'vendor',
                        test: /\/node_modules\//,
                        chunks: 'all',
                        priority: 0,
                        enforce: true,
                    },
                    styles: {
                        name: 'styles',
                        test: /\.css$/,
                        chunks: 'all',
                        enforce: true
                    },
                },
            },
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true // set to true if you want JS source maps
                }),
                new OptimizeCssAssetsPlugin({}),
            ],
        };
    }

    // Skip rendering index.html in test mode
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    // Render index.html
    if(!TEST) {
        config.plugins.push(
            new HtmlWebpackPlugin({
                filename: '../client/index.html',
                template: './client/_index.html',
                inject: 'body',
                alwaysWriteToDisk: true
            }),
            // new HtmlWebpackHarddiskPlugin()
        );
    }

    let localEnv;
    if(!BUILD) {
        try {
            localEnv = require('./server/config/local.env').default;
        } catch(e) {
            console.error('local.env not found', e);
            localEnv = {};
        }
    }
    localEnv = _.mapValues(localEnv, value => `"${value}"`);
    localEnv = _.mapKeys(localEnv, (value, key) => `process.env.${key}`);

    let env = Object.assign(localEnv, {
        'process.env.NODE_ENV': DEV ? '"development"'
            : BUILD ? '"production"'
                : TEST ? '"test"'
                    : '"development"'
    });
    console.log('env:', env);

    // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    // Define free global variables
    config.plugins.push(new webpack.DefinePlugin(env));

    // Add build specific plugins
    if(BUILD) {
        config.plugins.push(
            // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
            // Only emit files when there are no errors
            new webpack.NoEmitOnErrorsPlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
            // Dedupe modules in the output
            // FIXME: when webpack #2644 is fixed
            // new webpack.optimize.DedupePlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            // Minify all javascript, switch loaders to minimizing mode
            new UglifyJsPlugin(),
            // 53372
        );
    }

    config.cache = DEV;

    if(TEST) {
        config.stats = {
            colors: true,
            reasons: true
        };
    }

    /**
     * Dev server configuration
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */
    config.devServer = {
        contentBase: './client/',
        hot: true,
        proxy: {
            '/api': {
                target: 'http://localhost:9050',
                secure: false,
            },
            '/auth': {
                target: 'http://localhost:9050',
                secure: false,
            },
            '/primus': {
                target: 'http://localhost:9050',
                secure: false,
                ws: true,
            },
        },
        stats: {
            modules: false,
            cached: false,
            colors: true,
            chunks: false,
        },
        historyApiFallback: {
            index: 'index.html'
        },
    };

    config.node = {
        global: true,
        process: true,
        crypto: false,
        clearImmediate: false,
        setImmediate: false
    };

    return config;
};
