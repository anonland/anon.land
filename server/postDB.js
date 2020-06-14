const db = require("./setup-db.js");
const dbName = 'expitDB';

function createPost(postData, userPost, cbResult) {
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
                    cbResult(true);
                    console.log(result);
                }
                if (err) {
                    cbResult(false);
                }

                client.close();
            });

        }

    });

};

function filterPost(postData, userPost, cbResult){
    // esta funcion filtraria los posteos segun su seccion cambiandonlo de endpoint
}

module.exports={
    createPost
}