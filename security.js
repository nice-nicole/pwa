let lib = require('./lib')

const security = module.exports = {

    permissions: [
        { pattern: '^GET /favicon.ico', result: 'forbidden' },
        { pattern: '^GET /person', role: 'admin', result: null },
        { pattern: '^GET /person', role: '*', result: 'only for admin' },
    ],

    isForbidden: function(env) {
        let reqStr = env.req.method + ' ' + env.urlParsed.pathname
        let role = lib.sessions[env.session].role
        for(let i in security.permissions) {
            if(new RegExp(security.permissions[i].pattern).test(reqStr) && (security.permissions[i].role == '*' || security.permissions[i].role == role)) {
                return security.permissions[i].result
            }
        }
        return null
    }

}