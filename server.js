// embedded modules
let http = require('http')
let url = require('url')

// external modules
let nodestatic = require('node-static')
let uuid = require('uuid')
let cookies = require('cookies')

// own modules
let lib = require('./lib')
let person = require('./person')
let transfer = require('./transfer')
let history = require('./history')
let db = require('./db')
let example = require('./example')
let auth = require('./auth')

let httpServer = http.createServer()
let fileServer = new nodestatic.Server('./frontend')

httpServer.on('request', function(req, res) {

    // prepare object to pass to handling methods
    let env = { req, res }

    // cookies exchange
    let appCookies = new cookies(req, res)
    let session = appCookies.get('session')
    let now = Date.now()
    if(!session || !lib.sessions[session]) {
        session = uuid.v4()
        lib.sessions[session] = { from: req.connection.remoteAddress, created: now, touched: now }
    } else {
        lib.sessions[session].from = req.connection.remoteAddress
        lib.sessions[session].touched = now
    }
    appCookies.set('session', session, { httpOnly: false })
    env.session = session

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
        console.log(session, req.method, env.urlParsed.pathname, JSON.stringify(env.urlParsed.query), JSON.stringify(env.payload))
        switch(env.urlParsed.pathname) {
            case '/auth':
                auth.handle(env)
                break
            case '/person':
                person.handle(env)
                break
            case '/transfer':
                transfer.handle(env)
                break
            case '/history':
                history.handle(env)
                break
            default:
                fileServer.serve(req, res)
        }
    }) 
})

db.init(function() {
    example.initialize()
    httpServer.listen(7777)
})