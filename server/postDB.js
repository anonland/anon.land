const db = require("./setup-db.js");
const dbName = 'expitDB';


function createPost(postData, cbResult) {
    db.MongoClient.connect(db.uri, db.config, (err, client) => {
        if (err) {
            cbResult(false);
        } else {
            const serverDB = client.db('expitDB');
            const postCollections = serverDB.collection('postData');

            postCollections.insertOne(postData, (err, result) => {
                if (err) {
                    cbResult(false);
                } else {
                    cbResult(true, result.insertedId.toString());
                }

                client.close();
            });
        }
    });
};

function filterPost(Section, cbResult) {
    // esta funcion filtraria los posteos segun su seccion cambiandonlo de endpoint
    db.MongoClient.connect(db.uri, db.config, (err, client) => {
        if (err) {
            cbResult(false);
        } else {
            const serverDB = client.db('expitDB');
            const postCollections = serverDB.collection('postData');
            postCollections.find({ Section }).toArray(function (err, results) {
                if (err) {
                    cbResult(false);
                } else {
                    cbResult(true, results);
                }
            });
        }
    })
}
module.exports = {
    createPost,
    filterPost
}