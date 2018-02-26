const env = require('getenv');

module.exports = (path) => {
    require('dotenv').config({
        silent: true,
        path: path || undefined
    });
    
    return {        
        client: {
            key: env.string('DOCUMENTDB_KEY', ''),
            host: env.string('DOCUMENTDB_HOST', '')
        },
        path: {
            database: env.string('DOCUMENTDB_DATABASE', ''),
            collection: env.string('DOCUMENTDB_COLLECTION', '')
        },
        performance: {
            count: env.int('PERFORMANCE_COUNT', 100),
            concurrency: env.int('PERFORMANCE_CONCURRENCY', 10)
        }

    }
}