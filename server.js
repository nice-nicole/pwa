let http = require('http')
let url = require('url')

let nodestatic = require('node-static')

let httpServer = http.createServer()
let fileServer = new nodestatic.Server('./frontend')

let data = [
    { firstName: 'Mariusz', lastName: 'Jarocki', year: 1969 },
    { firstName: 'John', lastName: 'Doe', year: 2000 }
]

httpServer.on('request', function(req, res) {
    let urlParsed = url.parse(req.url, true)
    urlParsed.query = urlParsed.query ? urlParsed.query : {}
    console.log(req.method, urlParsed.pathname, urlParsed.query)
    switch(urlParsed.pathname) {

        case '/data':
            switch(req.method) {
                case 'GET':
                    res.writeHead(200, 'OK', {'Content-type': 'application/json'})
                    res.write(JSON.stringify(data))
                    res.end()
                    break
                case 'POST':
                    let payload = ''
                    req.on('data', function(data) {
                        payload += data
                    }).on('end', function() {
                        try {
                            payload = JSON.parse(payload)
                            data.push(payload)
                            console.log('PAYLOAD', payload)
                            res.writeHead(200, 'OK', {'Content-type': 'application/json'})
                            res.write(JSON.stringify(data))
                            res.end()    
                        } catch(ex) {
                            res.writeHead(400, 'Data corrupted', {'Content-type': 'application/json'})
                            res.end()            
                        }
                    })
                    break
                case 'DELETE':
                    let n = parseInt(urlParsed.query.n)
                    if(isNaN(n) || n < 0 || n >= data.length) {
                        res.writeHead(400, 'Bad index', {'Content-type': 'application/json'})
                        res.end()            
                        break
                    }
                    data.splice(n, 1)
                    res.writeHead(200, 'OK', {'Content-type': 'application/json'})
                    res.write(JSON.stringify(data))
                    res.end()
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