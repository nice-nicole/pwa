let ws = require('ws')

const lib = module.exports = {

    sessions: {},
    wsServer: null,
    
    sendJson: function(res, obj) {
        res.writeHead(200, {'Content-type': 'application/json'})
        res.write(JSON.stringify(obj))
        res.end()
    },
    sendError: function(res, errno, message = '') {
        res.writeHead(errno, {'Content-type': 'application/json'})
        res.write(JSON.stringify({ message: message }))
        res.end()
    },
    broadcast: function(message, selector = function(client) { return true }) {
        lib.wsServer.clients.forEach(function(client) {
            if(client.readyState == ws.OPEN && selector(client)) {
                console.log("Sending a message to client:", client.session.toString(), " with data:", message)
                client.send(message)
            }
        })
    }
}