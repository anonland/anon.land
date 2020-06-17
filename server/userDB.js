const db = require("./setup-db.js");
const { ObjectId } = require("mongodb");
const dbName = 'expitDB';

//  const collection = client.db(dbName).collection("userData");
// perform actions on the collection object


// login function..
function login(userid, password, cbResult) {
    db.MongoClient.connect(db.uri, db.config, (err, client) => {
        // if there's a problem connnecting to the server print error msg
        if (err) {
            cbResult({ msg: "Server ERROR" });
        }
        else {
            // get the name of the DB in atlas and the collection with the user documents
            const serverDB = client.db(dbName);
            const usersCollection = serverDB.collection('userData');

            usersCollection.findOne({
                userid,
                password
            }, (err, foundUser) => {
                if (err) {
                    // if you can consult the collection, return false with a msg, but a different msg
                    cbResult({
                        msg: "Server ERROR cant get user information"
                    });
                } else {
                    // User and password validation..
                    if (!foundUser) {
                        cbResult({
                            msg: "Invalid user or password"
                        });
                    } else {
                        cbResult(foundUser);
                    }

                }
                client.close();
            }
            )
        }

    });
}

// FUNCTION conults user in the DB
function getUser(userid, cbResult) {
    db.MongoClient.connect(db.uri, db.config, (err, client) => {
        if (err) {
            cbResult({ success: false });
        } else {
            // get the name of the DB in atlas and the collection with the user documents
            const serverDB = client.db(dbName);
            const usersCollection = serverDB.collection('userData');
            usersCollection.findOne({ userid }, (err, result) => {
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
// register function..
function register(password, cbResult) {
    db.MongoClient.connect(db.uri, db.config, (err, client) => {
        // if connection fails return false 
        if (err) { cbResult(false); }
        else {

            // get the name of the DB in atlas and the collection with the user documents
            const serverDB = client.db(dbName);
            const usersCollection = serverDB.collection('userData');

            let newUser = {
                rank: "Beta tester",
                password,
                points: 5
            }
            // Insert user in the db..
            usersCollection.insertOne(newUser, (err, result) => {
                if (err) {
                    cbResult(false);
                } else {
                    // updating the userid..
                    client.close();
                    let previousResult = result.ops[0];
                    previousResult.userid = previousResult._id.toString().slice(-5);
                        db.MongoClient.connect(db.uri, db.config, (err, client) => {

                            const serverDB2 = client.db(dbName);
                            const usersCollection2 = serverDB2.collection('userData');
                            // Update the userid to a sliced _id
                            usersCollection2.updateOne(
                                {
                                    _id: result.insertedId
                                }, {
                                $set: {
                                    userid: result.insertedId.toString().slice(-5)
                                }
                            }, (err, result) => {
                                if (err) {
                                    cbResult(false);
                                } else {
                                    cbResult(true, previousResult);
                                }
                                client.close();
                            });
                        });


                }

            });

        }
    });

}


module.exports = {
    register,
    getUser,
    login
};