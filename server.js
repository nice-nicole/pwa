let http = require('http')
let server = http.createServer()
server.on('request', function(req, res) {
    res.writeHead(200, 'OK', {'Content-type': 'text/plain'})
    res.write('Success!')
    res.end()
})
server.listen(7777)