// embedded modules
let http = require('http')
let url = require('url')

// external modules
let nodestatic = require('node-static')

// own modules
let lib = require('./lib')
let person = require('./person')
let balance = require('./balance')
let db = require('./db')

let httpServer = http.createServer()
let fileServer = new nodestatic.Server('./frontend')

httpServer.on('request', function(req, res) {

    // prepare object to pass to handling methods
    let env = { req, res }

    // parse url
    env.urlParsed = url.parse(req.url, true)

    // parse payload
    env.payload = ''
    req.on('data', function(data) {
        env.payload += data
    }).on('end', function() {
        try {
            // empty payload should result in {}
            env.payload = env.payload ? JSON.parse(env.payload) : {}
        } catch(ex) {
            lib.sendError(res, 400, ex.message)
            return
        }
        console.log(req.method, env.urlParsed.pathname, JSON.stringify(env.urlParsed.query), JSON.stringify(env.payload))
        switch(env.urlParsed.pathname) {
            case '/person':
                person.handle(env)
                break
            case '/balance':
                balance.handle(env)
                break
            default:
                fileServer.serve(req, res)
        }
    }) 
})

db.init(function() {
    httpServer.listen(7777)
})