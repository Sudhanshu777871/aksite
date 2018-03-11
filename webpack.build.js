process.env.NODE_ENV = 'production';

/**
 * Webpack config for builds
 */
module.exports = require('./webpack.make')({
    BUILD: true,
    TEST: false,
    DEV: false
});
