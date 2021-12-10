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
                db.users.findOne({ login: env.payload.login, password: env.payload.password }, function(err, result) {
                    if(!err && result) {
                        lib.sessions[env.session].login = result.login
                        lib.sessions[env.session].role = result.role
                        lib.sendJson(env.res, lib.sessions[env.session])
                    } else {
                        lib.sendError(env.res, 401, 'Authentication failed')    
                    }    
                })
                break
            case 'DELETE':
                // to log out from the system
                delete lib.sessions[env.session].login
                delete lib.sessions[env.session].role
                lib.sendJson(env.res, lib.sessions[env.session])
                break
            default:
                lib.sendError(env.res, 405, 'Method not implemented')
        }
    }
}