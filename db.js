const { MongoClient, ServerApiVersion } = require("mongodb");

const dotenv = require("dotenv")
dotenv.config()

let connection;

const uri = process.env.DB_URL

const connectToDb = async () => {
    try {
      connection = await MongoClient.connect(
        uri,
        { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1, }
      );
      console.log("Connected to MongoDB Atlas");
    } catch (err) {
      console.log("Error connecting to MongoDB Atlas: ", err);
      throw err;
    }
};

const getDb = () => {
    if (!connection) {
      throw new Error("Call connectToDb() before calling getDb()");
    }
    return connection.db('Coursework2');
  };

  module.exports = { connectToDb, getDb }