const env = require('getenv');

module.exports = (path) => {
    require('dotenv').config({
        silent: true,
        path: path || undefined
    });
    
    return {
        connectionString: env.string('DOCUMENTDB_CONNECTIONSTRING', ''),
        key: env.string('DOCUMENTDB_KEY', ''),
        host: env.string('DOCUMENTDB_HOST', ''),
        database: { id: env.string('DOCUMENTDB_DATABASE', '') },
        collection: { id: env.string('DOCUMENTDB_COLLECTION', '') }
    }
}