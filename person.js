const lib = require('./lib')

const person = module.exports = {

    data: [
        { firstName: 'Mariusz', lastName: 'Jarocki', year: 1969, balance: 100 },
        { firstName: 'John', lastName: 'Doe', year: 2000, balance: 20 }
    ],
    
    handle: function(env) {
        let n = parseInt(env.urlParsed.query.n)
        if((env.req.method == 'PUT' || env.req.method == 'DELETE') && isNaN(n) || n < 0 || n >= person.data.length) {
            lib.sendError(env.res, 400, 'Bad index (' + n + ')')
            return
        }
        switch(env.req.method) {
            case 'GET':
                lib.sendJson(env.res, person.data)
                break
            case 'POST':
                env.payload.balance = 0
                person.data.push(env.payload)
                lib.sendJson(env.res, person.data)
                break
            case 'PUT':
                let prevBalance = person.data[n].balance
                person.data[n] = env.payload
                person.data[n].balance = prevBalance
                lib.sendJson(env.res, person.data)
                break        
            case 'DELETE':
                person.data.splice(n, 1)
                lib.sendJson(env.res, person.data)
                break    
           default:
                lib.sendError(env.res, 405, 'Method not implemented')
        }
    }
}