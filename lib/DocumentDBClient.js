//const DocumentClient = require('documentdb').DocumentClient;
const DocumentClient = require('documentdb-q-promises').DocumentClientWrapper;
const { promisify } = require('util');
const DCCB = require('documentdb').DocumentClient;
const td = new DCCB();

class DocumentDBClient {
    constructor(config) {        
        this._client = new DocumentClient(config.host, { masterKey: config.key });                
        this._cache = {};    
        this._inited = false;
    }

    async getDb(dbName, createIfNotExists=true) {
        if (this._cache[dbName])
            return this._cache[dbName];
        
        let qs = {
            query: 'SELECT * FROM root r WHERE r.id = @id',
            parameters: [
                {
                    name: '@id',
                    value: dbName
                }
            ]
        };
        let db = (await this._client.queryDatabases(qs).toArrayAsync()).feed[0];    
        if (!db) {
            if (!createIfNotExists)
                return null;    
            let resource = (await this._client.createDatabaseAsync({ id: dbName})).resource; 
            resource._collections = {};
            return this._cache[dbName] = resource; 
        }
        db._collections = {};
        return this._cache[dbName] = db;
    }

    async getCollection(dbName, collectionName, createIfNotExists=true) {
        let db = await this.getDb(dbName, createIfNotExists);
        if (db._collections[collectionName])
            return db._collections[collectionName];
        let qs = {
            query: "select * from root r where r.id = @id",
            parameters: [{ name: '@id', value: collectionName}]
        }
        let collection = (await this._client.queryCollections(db._self, qs).toArrayAsync()).feed[0];
        if (!collection) {
            if (!createIfNotExists)
                return null;    
            let createResult = await this._client.createCollectionAsync(db._self, { id: collectionName});
            return db._collections[collectionName] = createResult.resource;
        }
        return db._collections[collectionName] = collection;
    }
    
    async queryDocument(dbName, collectionName, query) {
        await this.getCollection(dbName, collectionName);
        return [this._cache];
    }
   
    async deleteDatabase(dbName) {
        let db = await this.getDb(dbName, false);
        if (!db)
            return false;
        return this._client.deleteDatabaseAsync(db._self);
    }

    async upsertDocument(dbName, collectionName, document) {
        let collection = await this.getCollection(dbName, collectionName);
        return this._client.upsertDocumentAsync(collection._self, document);
    }
}

module.exports = DocumentDBClient;