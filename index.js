//requires
const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb')
//middleware
app.use(cors())
app.use(express.json())
//port
const port = process.env.PORT || 5000
//root get request
app.get('/', (req, res) => {
    res.send('server is working fine')
})
//mongodb
const uri = `mongodb+srv://database-user-1:databaseofzubayer@cluster0.1f3iy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri)
const run = () => {
    try {
        client.connect()
        const collection = client.db('todo').collection('todo')
        app.get('/list', async (req, res) => {
            const email = req.query.email
            const list = await collection.find({ email }).toArray()
            res.send(list)
        })
        app.post('/addwork', async (req, res) => {
            const task = req.body.task
            const result = await collection.insertOne(task)
            console.log(result.insertedId)
            res.send({ id: result.insertedId })
        })
    } finally { }
}
run()
//listen
app.listen(port)