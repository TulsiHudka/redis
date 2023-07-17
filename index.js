const express = require("express");
const Redis = require('ioredis');
const redis = new Redis({
    host: 'localhost', // Redis server hostname
    port: 8888, // Redis server port
    // Additional connection options (if required)
});
const axios = require("axios")
const app = express()
app.use(express.json())

app.post("/", async (req, res) => {
    const { key, value } = req.body;
    const response = await client.set(key, value)
    res.json(response)
})

app.get("/", async (req, res) => {
    const { key } = req.body;
    const value = await client.get(key);
    res.json(value)
})

app.get("/posts/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const cachedPost = await redis.get(`post-${id}`)
    console.log("cachedPost");
    if (cachedPost) {
        return res.json(JSON.parse(cachedPost))
    }
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${id}`)
    console.log("response");
    redis.set(`post-${id}`, JSON.stringify(response.data))

    return res.json(response.data)
})

app.listen(8888, async () => {
    console.log("Hey, now listening on port 8888");
})
