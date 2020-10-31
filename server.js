require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const router = require('./src/routers');
const cors = require('cors')

const app = express()
const port = 5000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api/v1', router)

app.listen(port, () => {
    console.log(`Server Runing at http://localhost:${port}`)
})