const lib = require('./lib')
const db = require('./db')

const auth = module.exports = {
  
    handle: function(env) {
        switch(env.req.method) {
            case 'GET':
                // to retrieve information about user
                lib.sendJson(env.res, lib.sessions[env.session])
                break
            case 'POST':
                // to validate credentials and log into the system
                if(env.payload.login && env.payload.login + '1' == env.payload.password) {
                    lib.sessions[env.session].login = env.payload.login
                    lib.sendJson(env.res, lib.sessions[env.session])
                } else {
                    lib.sendError(env.res, 401, 'Authentication failed')    
                }
                break
            case 'DELETE':
                // to log out from the system
                delete lib.sessions[env.session].login
                lib.sendJson(env.res, lib.sessions[env.session])
                break
            default:
                lib.sendError(env.res, 405, 'Method not implemented')
        }
    }
}