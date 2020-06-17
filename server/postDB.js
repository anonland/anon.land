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
// function to show all the posts..
function showPost(cbResult) {
    db.MongoClient.connect(db.uri, db.config, (err, client) => {
        if (err) {
            cbResult(false);
        } else {
            const serverDB = client.db('expitDB');
            const postCollections = serverDB.collection('postData');
            postCollections.find({}).toArray((err, postList) => {
                if (err) {
                    // return empty array
                    cbResult([]);
                } else {
                    cbResult(postList);
                }
                client.close();
            });
        }

    });

}
// function for post filtering..
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

function getPost(postid, cbResult) {
    db.MongoClient.connect(db.uri, db.config, (err, client) => {
        if (err) {
            cbResult({ success: false });
        } else {
            // get the name of the DB in atlas and the collection with the user documents
            const serverDB = client.db(dbName);
            const postCollection = serverDB.collection('postData');
            postCollection.findOne({ _id: new db.ObjectID(postid) }, (err, result) => {
                if (err) {
                    cbResult({ success: false });
                } else {
                    console.log('asdasdasd ', result);
                    cbResult({
                        success: true,
                        postid,
                    });
                }
                client.close();

            });
        }
    });
}
module.exports = {
    createPost,
    filterPost,
    showPost,
    getPost
}