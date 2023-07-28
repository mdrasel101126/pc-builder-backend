const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Pc Builder Server is Running!");
});

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.DB_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("PcBuilder");
    const productCollection = database.collection("products");
    app.get("/products", async (req, res) => {
      const products = await productCollection.find({}).toArray();
      res.send(products);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req?.params?.id;
      console.log(id);
      const product = await productCollection.findOne({
        _id: new ObjectId(id),
      });
      console.log(product);
      res.send(product);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch((error) => {
  console.log(error);
});

app.listen(port, () => {
  console.log("Server is running in port ", port);
});
