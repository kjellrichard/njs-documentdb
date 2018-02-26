const config = require('./config')();
const client = require('../index')(config.client);
const limit = require('promise-limit')(config.performance.concurrency);

let dbName = config.path.database,
    collectionName = config.path.collection,
    idx = 0, count = config.performance.count;

async function insert() {
    ++idx;
    return client.upsertDocument(dbName, collectionName, { id: `doc ${idx}`, text: `Content of ${idx}` });
}

(async () => {
     
    try {
        let grandStart = new Date();
        await insert();
        
        let sequenceStart = new Date();
        //for (let i of [...new Array(count)]) {        
        //    let d = new Date();
        //    await insert(); 
        //    console.log(`Took ${new Date() - d}ms`);
        //}
        let sequenceElapsed = new Date() - sequenceStart;
        console.log(`Sequence took ${sequenceElapsed}ms, avg ${Math.floor(sequenceElapsed / count)}ms`);
        
        let paralellStart = new Date();
        await Promise.all([...new Array(count)].map(i => limit(() => insert())));
        let paralellElapsed = new Date() - paralellStart;
        console.log(`Paralell with limit ${config.performance.concurrency} took ${paralellElapsed}ms, avg ${Math.floor(paralellElapsed / count)}ms`);
        
        await client.deleteDatabase(dbName);
        console.log(`It all took ${new Date() - grandStart}ms`);
    } catch (e) {
        console.error(e);
    }    
    
})();

