
const client = require('../index')(require('./bootstrap')());
let dbName = 'test',
    collectionName = 'test',
    idx = 0, count = 10;

async function insert() {
    ++idx;
    return client.upsertDocument(dbName, collectionName, { id: `doc ${idx}`, text: `Content of ${idx}` });
}

(async () => {
     
    try {
        let grandStart = new Date();
        await insert();
        
        let sequenceStart = new Date();
        for (let i of [...new Array(count)]) {        
            let d = new Date();
            await insert(); 
            console.log(`Took ${new Date() - d}ms`);
        }
        let sequenceElapsed = new Date() - sequenceStart;
        console.log(`Sequence took ${sequenceElapsed}ms, avg ${Math.floor(sequenceElapsed / count)}ms`);
        
        let paralellStart = new Date();
        await Promise.all([...new Array(100)].map(i => insert()))
        console.log(`Paralell took ${new Date() - paralellStart}ms`);
        
        await client.deleteDatabase(dbName);
        console.log(`It all took ${new Date() - grandStart}ms`);
    } catch (e) {
        console.error(e);
    }    
    
})();

