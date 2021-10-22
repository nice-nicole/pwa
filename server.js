let http = require('http')

let nodestatic = require('node-static')

let httpServer = http.createServer()
let fileServer = new nodestatic.Server('./frontend')

let data = [
    { firstName: 'Mariusz', lastName: 'Jarocki', year: 1969 },
    { firstName: 'John', lastName: 'Doe', year: 2000 }
]

httpServer.on('request', function(req, res) {
    console.log(req.method, req.url)
    switch(req.url) {

        case '/data':
            switch(req.method) {
                case 'GET':
                    res.writeHead(200, 'OK', {'Content-type': 'application/json'})
                    res.write(JSON.stringify(data))
                    res.end()
                    break
                case 'POST':
                    req.on('data', function(data) {
                        console.log(data)
                    }).on('end', function() {
                        res.writeHead(200, 'OK', {'Content-type': 'application/json'})
                        res.write(JSON.stringify(data))
                        res.end()    
                    })
                    break
                default:
                    res.writeHead(405, 'Method not allowed', {'Content-type': 'application/json'})
                    res.end()
            }
            break
        default:
            fileServer.serve(req, res)
    }
})

httpServer.listen(7777)