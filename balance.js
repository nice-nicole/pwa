const { CommandStartedEvent } = require('mongodb')
const db = require('./db')
const lib = require('./lib')
const person = require('./person')

const balance = module.exports = {

    validateAmount: function(amount) {
        return !isNaN(amount) && amount > 0 
    },

    validateTransfer: function(transfer) {
        transfer.from = db.ObjectId(transfer.from)
        transfer.to = db.ObjectId(transfer.to)
        return transfer.from && transfer.to && balance.validateAmount(transfer.amount)
    },

    handle: function(env) {
        switch(env.req.method) {
            case 'POST':
                // deposit/withdraw the amount on/from all accounts
                if(balance.validateAmount(env.payload.amount)) {
                    // person.data.forEach(function(obj) { obj.balance += env.payload.amount })
                    db.persons.updateMany({}, { $inc: { balance: env.payload.amount } }, function(err, result) {
                        if(!err)
                            person.sendData(env.res)
                        else   
                            lib.sendError(env.res, 400, 'Update records failed')
                    })
                } else {
                    lib.sendError(env.res, 400, 'Wrong amount')
                }
                break
            case 'PUT':
                // transfer the amount from one account to another
                let transfer = { from: env.payload.from, to: env.payload.to, amount: env.payload.amount }
                if(balance.validateTransfer(transfer)) {
                    //
                    // HOMEWORK: write a code which decrement "from" account by the amount and
                    //           increment "to" account (use findOneAndUpdate twice)
                    //
                    person.sendData(env.res)
                } else {
                    lib.sendError(env.res, 400, 'Wrong from, to or amount')
                }
                break        
           default:
                lib.sendError(env.res, 405, 'Method not implemented')
        }
    }
}