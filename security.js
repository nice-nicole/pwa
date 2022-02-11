let lib = require('./lib')

const security = module.exports = {

    permissions: [
        { pattern: '', role: 'admin', result: null }, // admin has full access to any url in our system
        { pattern: '^GET /person$', role: 'user', result: null },
        { pattern: ' /person$', role: '*', result: 'forbidden' },
        { pattern: '^GET /person$', role: 'user', result: null },
        { pattern: ' /person$', role: '*', result: 'forbidden' },
        { pattern: ' /transfer$', role: 'user', result: null },
        { pattern: ' /transfer$', role: '*', result: 'forbidden' },
        { pattern: ' /history$', role: '*', result: 'forbidden' },
        { pattern: ' /auth$', role: '*', result: null }, // everyone can log in/log out
        { pattern: '^GET /', result: '*', result: null }, // static content for everyone (main page)
        { pattern: '^GET /favicon.ico', result: '*', result: null }, // static content for everyone (favicon.ico)
        { pattern: '^GET /images/', result: '*', result: null }, // static content for everyone (images)
        { pattern: '^GET /.*\.(html|js|css)$', result: '*', result: null }, // rest of static content
        { pattern: '', result: '*', result: 'forbidden' } // default rule: prohibition
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