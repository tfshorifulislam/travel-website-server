const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;

const app = express();
const PORT = process.env.PORT 
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const db = client.db('wanderlust')
        const destinationCollection = db.collection('destinations')

        app.post('/destination', async (req, res) => {
            const destinationData = req.body;
            console.log(destinationData);
            const result = await destinationCollection.insertOne(destinationData);
            res.json(result);

        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});