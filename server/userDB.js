const db = require("./setup-db.js");
const dbName = 'expitDB';

//  const collection = client.db(dbName).collection("userData");
// perform actions on the collection object


// login function
function login(username, password, cbResult) {

    db.MongoClient.connect(db.uri, db.config, (err, client) => {
        // if there's a problem connnecting to the server print error msg
        if (err) { cbResult({ msg: "Server ERROR" }); }
        else {
            // get the name of the DB in atlas and the collection with the user documents
            const serverDB = client.db(dbName);
            const usersCollection = serverDB.collection('userData');

            usersCollection.findOne({
                user,
                password: PW
            }, (err, foundUser) => {
                if (err) {
                    // if you can consult the collection, return false with a msg, but a different msg
                    cbResult({
                        msg: "Server ERROR cant get user information"
                    });
                } else {
                    // User and password validation..
                    if (!foundUser) {
                        cbResult({ msg: "Invalid user or password" });
                    } else {
                        cbResult({
                            user: {
                                user: foundUser.user,
                                rank: foundUser.rank,
                                admin: foundUser.admin,
                                points: foundUser.points,
                            }
                        });
                    }

                }
                client.close();
            }
            )
        }

    });




}

// FUNCTION conults user in the DB
function getUser(username, cbResult) {
    db.MongoClient(db.uri, db.config, (err, client) => {
        if (err) {
            cbResult({ success: false });
        } else {
            // get the name of the DB in atlas and the collection with the user documents
            const serverDB = client.db('expitDB');
            const usersCollection = serverDB.collection('userData');

            usersCollection.findOne({ user: username }, (err, result) => {
                if (err) {
                    cbResult({ success: false });
                } else {
                    cbResult({
                        success: true,
                        user: result
                    });
                }
                client.close();

            });
        }
    });
}

// register function
function register(password, cbResult) {
    console.log("estoy en el register " + password);

    db.MongoClient.connect(db.uri, db.config, (err, client) => {
        // if connection fails return false 
        if (err) { cbResult(false); }
        else {

            // get the name of the DB in atlas and the collection with the user documents
            const serverDB = client.db('expitDB');
            const usersCollection = serverDB.collection('userData');

            let newUser = {
                // possible id ?
                rank: "..",
                password,
                points: 5
            }
            // Insertamos el user en la DB
            usersCollection.insertOne(newUser, (err, result) => {

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

}

/** 
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
*/


// client.close();

module.exports = { 
    register,


};