const express = require('express');
const app = express();
const mongoose = require('mongoose')
const PORT = 8000
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost:27017/fb')
    .then(() => {
        console.log('Connected to Database')
    }).catch((err) => {
        console.log('Not Connected to Database ERROR! ', err)
    })

app.use(cors())

app.use(
    bodyParser.urlencoded({
        limit: '50mb',
        extended: true
    })
)

app.use(bodyParser.json({ limit: '50mb' }))

app.use(require('./server/routes'))

const server = http.createServer(app).listen(PORT)

module.exports = { server, app }

