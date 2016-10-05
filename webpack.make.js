'use strict';
/*eslint-env node*/
const _ = require('lodash');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var path = require('path');

module.exports = function makeWebpackConfig(options) {
    /**
     * Environment type
     * BUILD is for generating minified builds
     * TEST is for generating test builds
     */
    var BUILD = !!options.BUILD;
    var TEST = !!options.TEST;
    var DEV = !!options.DEV;

    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    var config = {};

    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     * Should be an empty object if it's generating a test build
     * Karma will set this when it's a test build
     */
    if(TEST) {
        config.entry = {};
    } else {
        config.entry = {
            polyfills: './client/app/polyfills.js',
            app: './client/app/index.js',
            vendor: [
                'raven-js',
                'react',
                'react-dom',
                'showdown'
            ]
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
        extensions: ['.js', '.ts']
    };

    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    if(TEST) {
        config.devtool = 'inline-source-map';
    } else if(BUILD || DEV) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'eval';
    }

    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */

    // Initialize module
    config.module = {
        noParse: [
            path.join(__dirname, 'node_modules', 'zone.js', 'dist'),
            path.join(__dirname, 'node_modules', '@angular', 'bundles')
        ],
        rules: [{
            // JS LOADER
            // Reference: https://github.com/babel/babel-loader
            // Transpile .js files using babel-loader
            // Compiles ES6 and ES7 into ES5 code
            test: /\.js$/,
            use: {
                loader: 'babel',
                options: {
                    babelrc: false,
                    presets: [
                        ['es2015', { modules: false }],
                        // 'es2015',
                        'stage-0',
                        'react'
                    ],
                    plugins: [
                        'angular2-annotations',
                        'angularjs-annotate',
                        'transform-runtime',
                        'transform-decorators-legacy'
                    ],
                    shouldPrintComment(commentContents) {
                        let regex = DEV
                            // keep `// @flow`, `/*@ngInject*/`, & flow type comments in dev
                            ? /(@flow|@ngInject|^:)/
                            // keep `/*@ngInject*/`
                            : /@ngInject/;
                        return regex.test(commentContents);
                    }
                },
            },
            include: [
                path.resolve(__dirname, 'client/'),
                path.resolve(__dirname, 'server/config/environment/shared.js'),
                path.resolve(__dirname, 'node_modules/lodash-es/')
            ]
        }, {
            // TS LOADER
            // Reference: https://github.com/s-panferov/awesome-typescript-loader
            // Transpile .ts files using awesome-typescript-loader
            test: /\.ts$/,
            use: 'awesome-typescript-loader',
            include: [
                path.resolve(__dirname, 'client/')
            ]
        }, {
            // ASSET LOADER
            // Reference: https://github.com/webpack/file-loader
            // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
            // Rename the file using the asset hash
            // Pass along the updated reference to your code
            // You can add here any file extension you want to get copied to your output
            test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
            use: 'file'
        }, {
            // HTML LOADER
            // Reference: https://github.com/webpack/raw-loader
            // Allow loading html through js
            test: /\.html$/,
            use: 'raw'
        }, {
            // SASS LOADER
            // Reference: https://github.com/jtangelder/sass-loader
            test: /\.scss$/,
            use: ['style', 'css', 'sass'],
            include: [
                path.resolve(__dirname, 'node_modules/angular-material/angular-material.scss'),
                path.resolve(__dirname, 'client/app/app.scss')
            ]
        }, {
            // SASS LOADER
            // Reference: https://github.com/jtangelder/sass-loader
            test: /\.scss$/,
            use: ['raw', 'sass'],
            include: [path.resolve(__dirname, 'client')],
            exclude: [/app\.scss$/]
        }, {
            test: /(photoswipe)/,
            use: 'imports?define=>false&this=>window'
        }, {
            enforce: 'post',
            test: /\.(js|ts)$/,
            use: 'ng-annotate?single_quotes'
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
            use: 'isparta'
        });
    }

    // CSS LOADER
    // Reference: https://github.com/webpack/css-loader
    // Allow loading css through js
    //
    // Reference: https://github.com/postcss/postcss-loader
    // Postprocess your css with PostCSS plugins
    var cssLoader = {
        test: /\.css$/,
        // Reference: https://github.com/webpack/extract-text-webpack-plugin
        // Extract css files in production builds
        //
        // Reference: https://github.com/webpack/style-loader
        // Use style-loader in development for hot-loading
        use: ExtractTextPlugin.extract({fallbackLoader: 'style', loader: 'css?sourceMap!postcss'})
    };

    // Skip loading css in test mode
    if(TEST) {
        // Reference: https://github.com/webpack/null-loader
        // Return an empty module
        cssLoader.use = 'null';
    }

    // Add cssLoader to the loader list
    config.module.rules.push(cssLoader);

    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [
        // Reference: https://github.com/webpack/extract-text-webpack-plugin
        // Extract css files
        // Disabled when in test mode or not in build mode
        new ExtractTextPlugin({
            filename: '[name].[hash].css',
            disable: !BUILD || TEST
        }),
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
                autoprefixer({
                    browsers: ['last 2 version']
                })
            ],
            sassLoader: {
                includePaths: require('bourbon').includePaths,
                outputStyle: 'compressed',
                precision: 10,
                sourceComments: false
            },
            isparta: {
                embedSource: true,
                noAutoWrap: true,
            }
        })
    ];

    if(!TEST) {
        config.plugins.push(new CommonsChunkPlugin({
            name: 'vendor',

            // filename: "vendor.js"
            // (Give the chunk a different name)

            minChunks: Infinity
            // (with more entries, this ensures that no other module
            //  goes into the vendor chunk)
        }));
    }

    if(BUILD) {
        config.plugins.push(new webpack.LoaderOptionsPlugin({
            debug: true
        }));
    }

    // Skip rendering index.html in test mode
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    // Render index.html
    config.plugins.push(
        new HtmlWebpackPlugin({
            filename: '../client/index.html',
            template: './client/_index.html',
            inject: 'body',
            alwaysWriteToDisk: true
        }),
        new HtmlWebpackHarddiskPlugin()
    );

    let localEnv;
    try {
        localEnv = require('./server/config/local.env').default;
    } catch(e) {
        localEnv = {};
    }
    localEnv = _.mapValues(localEnv, value => `"${value}"`);
    localEnv = _.mapKeys(localEnv, (value, key) => `process.env.${key}`);

    let env = _.merge({
        'process.env.NODE_ENV': DEV ? '"development"'
            : BUILD ? '"production"'
            : TEST ? '"test"'
            : '"development"'
    }, localEnv);

    // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    // Define free global variables
    config.plugins.push(new webpack.DefinePlugin(env));

    // Add build specific plugins
    if(BUILD) {
        config.plugins.push(
            // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
            // Only emit files when there are no errors
            new webpack.NoErrorsPlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
            // Dedupe modules in the output
            // FIXME: when webpack #2644 is fixed
            // new webpack.optimize.DedupePlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            // Minify all javascript, switch loaders to minimizing mode
            new webpack.optimize.UglifyJsPlugin({
                minimize: true,
                mangle: false,
                output: {
                    comments: false
                },
                compress: {
                    warnings: false
                }
            })
        );
    }

    config.cache = !!DEV;

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
        stats: {
            modules: false,
            cached: false,
            colors: true,
            chunks: false
        }
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
