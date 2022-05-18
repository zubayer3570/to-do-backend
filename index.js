//requires
const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ObjectId } = require('mongodb')
//middleware
const corsConfig = {
    origin: true,
    credentials: true
}
app.use(cors(corsConfig))
app.options("*", cors(corsConfig))
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
        const collection = client.db('todo').collection('list')
        app.get('/list', async (req, res) => {
            const email = req.query.email
            const list = await collection.find({ email }).toArray()
            res.send(list)
        })
        app.post('/addwork', async (req, res) => {
            const task = req.body.task
            const result = await collection.insertOne(task)
            res.send({ id: result.insertedId })
        })
        app.put('/completed', async (req, res) => {
            const id = req.body.id
            const query = {
                _id: ObjectId(id)
            }
            await collection.updateOne(query, {
                $set: {
                    strikeThrough: true
                }
            },
                {
                    upsert: true
                })
            res.send('completed')
        })
        app.delete('/delete', async (req, res) => {
            const id = req.body.id
            console.log(id)
            const query = {
                _id: ObjectId(id)
            }
            const result = await collection.deleteOne(query)
            console.log(result)
            res.send({ message: 'Task Deleted' })
        })
    } finally { }
}
run()
//listen
app.listen(port)