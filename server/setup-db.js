// setting up the DB using atlas GCP located in Sao Paulo, Brazil
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://gruntplay:allahuakbar@expressit-tv0oy.gcp.mongodb.net/Expressit?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
const config = { useUnifiedTopology: true };
const mongodb = require("mongodb");
const ObjectID = mongodb.ObjectID;

module.exports = {
    MongoClient,
    uri,
    config,
    ObjectID  
  }


