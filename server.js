'use strict'

const http = require('http')
const os = require('os')
const url = require('url')
const path = require('path')
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')

const app = express()
const router = express.Router()

let siteURL
let port = 9550
const server = http.createServer(app)
server.listen(port, () => {
  const a = server.address()
  port = a.port
  siteURL = 'http://' + os.hostname() + ':' + port
  console.log('Running at: ', siteURL)
})

router.use(logger('short'))
router.use(express.static(path.join(__dirname, 'static'),
                          {extensions: ['html', 'css']}))
app.use(bodyParser.json())
app.use('/', router)

app.post('/webhooks/:id', (req, res) => {
  console.log('webhook called', req.params)
  console.log('body', req.body)
  res.status(201).end()
})

/*

curl -v -H "Content-Type: application/json" http://magrathea:9550/webhooks/4894949 -d '{"a":500, "b":"a"}'

*/
