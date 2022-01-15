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

    isClientLogged: function(client) {
        return lib.sessions[client.session] && lib.sessions[client.session].role
    },

    isClientAdmin: function(client) {
        return lib.sessions[client.session] && lib.sessions[client.session].role == 'admin'
    },

    // broadcast message { event: '...', ... }
    // default selector: broadcase only to logged users
    broadcast: function(message, selector = lib.isClientLogged) {
        let n = 0, m = 0
        lib.wsServer.clients.forEach(function(client) {
            m++
            if(client.readyState == ws.OPEN && selector(client)) {
                client.send(JSON.stringify(message))
                n++
            }
        })
        console.log('Sending a message', JSON.stringify(message), 'to', n, 'of', m, 'total clients')
    }
}