/*eslint no-process-env:0*/

// Development specific configuration
// ==================================
export default {
    // MongoDB connection options
    mongo: {
        useMongoClient: true,
        uri: 'mongodb://localhost:27017/aksite-dev'
    },

    seedDB: true
};
