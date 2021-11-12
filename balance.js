const lib = require('./lib')
const person = require('./person')

const balance = module.exports = {

    validateAmount: function(amount) {
        return !isNaN(amount) && amount > 0 
    },

    validateTransfer: function(transfer) {
        transfer.from = parseInt(transfer.from)
        transfer.to = parseInt(transfer.to)
        return !isNaN(transfer.from) && transfer.from >= 0 && transfer.from < person.data.length &&
               !isNaN(transfer.to) && transfer.to >= 0 && transfer.to < person.data.length &&
               transfer.to != transfer.from &&
               balance.validateAmount(transfer.amount) &&
               person.data[transfer.from].balance >= transfer.amount
    },

    handle: function(env) {
        switch(env.req.method) {
            case 'POST':
                // deposit/withdraw the amount on/from all accounts
                if(balance.validateAmount(env.payload.amount)) {
                    person.data.forEach(function(obj) { obj.balance += env.payload.amount })
                    lib.sendJson(env.res, person.data)
                } else {
                    lib.sendError(env.res, 400, 'Wrong amount')
                }
                break
            case 'PUT':
                // transfer the amount from one account to another
                let transfer = { from: env.payload.from, to: env.payload.to, amount: env.payload.amount }
                if(balance.validateTransfer(transfer)) {
                    person.data[transfer.from].balance -= transfer.amount
                    person.data[transfer.to].balance += transfer.amount
                    lib.sendJson(env.res, person.data)   
                } else {
                    lib.sendError(env.res, 400, 'Wrong from, to or amount')
                }
                break        
           default:
                lib.sendError(env.res, 405, 'Method not implemented')
        }
    }
}