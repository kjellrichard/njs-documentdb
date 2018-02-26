const Client = require('./lib/DocumentDBClient');

module.exports = (options) => {
    return new Client(options);
};