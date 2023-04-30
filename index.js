const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rbhccf3.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    const serviceCollection = client.db('genius-car').collection('services');
    const orderCollection = client.db('genius-car').collection('orders');
    app.get('/service', async(req,res)=>{
      const query = {}
      const cursor= serviceCollection.find(query);
      const services= await cursor.toArray();
      res.send(services);
    })
    app.get('/service/:id',async (req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const service = await serviceCollection.findOne(query);
      res.send(service);
    })
    app.get('/order',async (req,res)=>{
      let query = {};
      if(req.query.email){
        query ={
          email: req.query.email
        }
      }
      const cursor= orderCollection.find(query);
      const orders= await cursor.toArray();
      res.send(orders);
    })
  
    app.post('/order',async (req,res)=>{
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    })
    app.patch('/order/:id', async(req,res)=>{
      const id = req.params.id;
      const status= req.body.status;
      const query = {_id: new ObjectId(id)}
      const updatedDoc = {
        $set: { status:status}
      }
      const result = await orderCollection.updateOne(query,updatedDoc);
      res.send(result);
    })
      app.delete('/order/:id',async (req,res)=>{
            const id = req.params.id;
            const query = {_id:new ObjectId(id)};
            //console.log('Trying delete user', id)
            const result = await orderCollection.deleteOne(query)
            res.send(result);
            console.log(result);
        })
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
   res.send('genius cars running')
})

app.listen(port, ()=>{
    console.log(`genius cars running ${port}`)
})