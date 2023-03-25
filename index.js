const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

const app = express();

// middleware
app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gkejsh2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const appointmentOptionCollection = client.db('perlourApplication').collection('appointmentOptions');

        app.get('/appointmentOptions',async(req,res) => {
            const query = {};
            const options = await appointmentOptionCollection.find(query).toArray();
            res.send(options)
        })

    }
    finally{

    }
}
run().catch(console.log )


app.get('/',(req,res)=>{
    res.send('perlour app is running')
})

app.listen(port,()=>{console.log('perolour app runing on 5000');})