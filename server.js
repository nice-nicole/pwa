// embedded modules
let http = require('http')
let url = require('url')

// external modules
let nodestatic = require('node-static')

// own modules
let person = require('./person')

let httpServer = http.createServer()
let fileServer = new nodestatic.Server('./frontend')

httpServer.on('request', function(req, res) {

    // prepare object to pass to handling methods
    let env = { req: req, res: res }

    // parse url
    env.urlParsed = url.parse(req.url, true)
    env.urlParsed.query = env.urlParsed.query ? env.urlParsed.query : {}

    // parse payload
    env.payload = ''
    req.on('data', function(data) {
        env.payload += data
    }).on('end', function() {
        try {           
            env.payload = env.payload ? JSON.parse(env.payload) : {}
        } catch(ex) {
            res.writeHead(400, 'JSON broken', {'Content-type': 'application/json'})
            res.end()            
            return
        }
        console.log(req.method, env.urlParsed.pathname, env.urlParsed.query, env.payload)
        switch(env.urlParsed.pathname) {
            case '/person':
                person.handle(env)
                break
            default:
                fileServer.serve(req, res)
        }
    }) 
})

httpServer.listen(7777)