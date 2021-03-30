const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser');
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;


const app = express()
app.use(bodyParser.json())
app.use(cors())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1znel.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World! im working')
})

//database code
client.connect(err => {
  const productsCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  const ordersCollection = client.db(`${process.env.DB_NAME}`).collection("orders");
  app.post('/addProducts', (req, res) => {
    const products = req.body;
    console.log(products)
    productsCollection.insertOne(products)
      .then(result => {
        console.log(result)
        res.send(result.insertedCount)
      })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/product/:key', (req, res) => {
    productsCollection.find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })
  //find by in
  app.post('/productByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({ key: { $in: productKeys } })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.post('/addOrder', (req, res) => {
    const products = req.body;
    console.log(products)
    ordersCollection.insertOne(products)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })


});


app.listen(process.env.PORT || port)