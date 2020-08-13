const db = require("./setup-db.js");
const dbName = 'expitDB';

// create post function..
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
                    // This gives to the post, an ID to make the Endpoint for the post..
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
    // acá voy a hacer que se filtre por Date (fecha)
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
            postCollection.findOne({ _id: db.ObjectID(postid) }, (err, result) => {
                if (err) {
                    cbResult({ success: false });
                } else {
                    cbResult({
                        success: true,
                        result
                    });
                }
                client.close();

            });
        }
    });
}

// function to add comments in the postdb documents..
function comment(postData, cbResult) {
    db.MongoClient.connect(db.uri, db.config, (err, client) => {
        if (err) {
            cbResult(false);
        } else {
            const serverDB = client.db(dbName);
            const postCollection = serverDB.collection('postData');

            postCollection.updateOne({
                _id: result.insertedId
            },
                {
                    $push: {
                        comment: {
                            userid,
                            userRank,
                            commentDate,
                            commentTXT
                        }
                    }

                }, (err, result) => {
                    if (err) {
                        cbResult(false);
                    } else {
                        cbResult(true);
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
    getPost,
    comment
}