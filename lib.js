const lib = module.exports = {
    sendJson: function(res, obj) {
        res.writeHead(200, {'Content-type': 'application/json'})
        res.write(JSON.stringify(obj))
        res.end()
    },
    sendError: function(res, errno, message = '') {
        res.writeHead(errno, {'Content-type': 'application/json'})
        res.write(JSON.stringify({ message: message }))
        res.end()
    }
}