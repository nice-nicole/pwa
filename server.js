let http = require('http')

let nodestatic = require('node-static')

let httpServer = http.createServer()
let fileServer = new nodestatic.Server('./frontend')

httpServer.on('request', function(req, res) {
    /*
    res.writeHead(200, 'OK', {'Content-type': 'text/plain'})
    res.write('Success! ' + req.url)
    res.end()
    */
    fileServer.serve(req, res);
})

httpServer.listen(7777)