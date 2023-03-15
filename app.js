const express = require('express')
const app = express()
const config = require('./config.json')
const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

app.use(session({
    secret: 'luwygdfo',
    resave: false,
    saveUninitialized: true,
    store: new FileStore({ logFn: () => { } }),
    cookie: {
        maxAge: 1800000
    }
}))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: true }))




app.listen(config.port, () => {
    console.log("http://localhost:3002")
})