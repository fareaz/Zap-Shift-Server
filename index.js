const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = 3000

app.use(express.json())
app.use(cors())
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.5rsc2du.mongodb.net/?appName=Cluster0`;
// const uri = "mongodb+srv://Zap_Shift_Server:btj7VKJ6jsqQ3F5Q@cluster0.5rsc2du.mongodb.net/?appName=Cluster0";

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
    const db = client.db('zap_shift_db');
    const parcelsCollection = db.collection('parcels');
    

        //  parcel api
        app.get('/parcels', async (req, res) => {
            const query = {}
            const {email} = req.query;
            // /parcels?email=''&
            if(email){
                query.senderEmail = email;
            }
            const options = { sort: { createdAt: -1 } }
            const result = await parcelsCollection.find(query,options).toArray();
            res.send(result);
        })
            app.post('/parcels', async (req, res) => {
            const parcel = req.body;

             // parcel created time
            parcel.createdAt = new Date();

            const result = await parcelsCollection.insertOne(parcel);
            res.send(result)
        })




    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})