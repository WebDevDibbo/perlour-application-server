const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const bookingsCollection = client.db('perlourApplication').collection('bookings');
        const usersCollection = client.db('perlourApplication').collection('users');

        app.get('/appointmentOptions',async(req,res) => {
            const date = req.query.date;
            const query = {};
            const options = await appointmentOptionCollection.find(query).toArray();
            const bookingQuery = {appointmentDate : date};
            const alreadyBooked = await bookingsCollection.find(bookingQuery).toArray();
            options.forEach(option => {
                const optionBooked = alreadyBooked.filter(book => book.treatment === option.name)
                const bookedSlots = optionBooked.map(bookSlot => bookSlot.slot );
                const remainingSlots = option.slots.filter(slot => !bookedSlots.includes(slot))
                option.slots = remainingSlots;
                console.log(date,option.name,remainingSlots.length);
            })
            res.send(options)
        })

        app.get('/bookings',async(req,res) => {
            const email = req.query.email;
            const query = {email: email}
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings)
        })
        app.post('/bookings',async(req,res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.send(result)
        })
        app.post('/users',async(req,res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        })
        app.get('/users',async(req,res) => {
            const query = {};
            const result = await usersCollection.find(query).toArray();
            res.send(result)
        })
        app.put('/users/admin/:id',async(req,res) => {
            const id = req.params.id;
            const filter =  { _id : new ObjectId(id)};
            const options = { upsert: true };
            const updatedDoc = {
                $set:{
                    role : "admin"
                }
            }
            const result = await usersCollection.updateOne(filter,updatedDoc,options);
            res.send(result);
        })

    }
    finally{

    }
}
run().catch(console.log )


app.get('/',(req,res)=>{
    res.send('perlour app is running')
})

app.listen(port,()=>{console.log(`perlour app runing on ${port}`)})