// setting up the DB using atlas GCP located in Sao Paulo, Brazil
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://gruntplay:allahuakbar@expressit-tv0oy.gcp.mongodb.net/Expressit?retryWrites=true&w=majority";
// const dbName = 'expitDB';
const client = new MongoClient(uri, { useNewUrlParser: true });
/** 
client.connect(err => {
    const collection = client.db(dbName).collection("userData");
    // perform actions on the collection object
    client.close();
  });
*/

const config = { useUnifiedTopology: true };

module.exports = {
    MongoClient,
    uri,
    config
  }


