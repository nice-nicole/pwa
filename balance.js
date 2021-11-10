const lib = require('./lib')
const person = require('./person')

const balance = module.exports = {

    validateAmount: function(amount) {
        return !isNaN(amount) && amount > 0 
    },

    handle: function(env) {
        let from = -1, to = -1
        if(env.req.method == 'PUT') {
            from = parseInt(env.payload.from)
            to = parseInt(env.payload.to)
            if(isNaN(from) || from < 0 || from >= person.data.length ||
               isNaN(to) || to < 0 || to >= person.data.length || to == from ||
               balance.validateAmount(env.payload.amount) ||
               person.data[from].balance < env.payload.amount) {
                lib.sendError(env.res, 400, 'Bad indices (' + from + ',' + to + ') or not enough money')
                return
            }
        }
        switch(env.req.method) {
            case 'POST':
                // deposit/withdraw the amount on/from all accounts
                if(balance.validateAmount(env.payload.amount)) {
                    person.data.forEach(function(obj) { obj.balance += env.payload.amount })
                    lib.sendJson(env.res, person.data)
                } else {
                    lib.sendError(env.res, 400, 'Bad amount')
                }
                break
            case 'PUT':
                // transfer the amount from one account to another
                person.data[from].balance -= env.payload.amount
                person.data[to].balance += env.payload.amount
                lib.sendJson(env.res, person.data)
                break        
           default:
                lib.sendError(env.res, 405, 'Method not implemented')
        }
    }
}