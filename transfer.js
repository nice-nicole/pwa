const mongodb = require('mongodb')
const db = require('./db')
const lib = require('./lib')
const person = require('./person')

const transfer = module.exports = {

    validateAmount: function(amount) {
        return !isNaN(amount) && amount != 0 
    },

    validateTransaction: function(transaction) {
        transaction.person_id = db.ObjectId(transaction.person_id)
        return transaction.person_id && transfer.validateAmount(transaction.amount)
    },

    handle: function(env) {
        let now = Date.now()
        switch(env.req.method) {
            case 'POST':
                lib.broadcast('Deposit on all', function(client) {
                    return client.session != env.session
                })
                // deposit/withdraw the amount on/from all accounts
                if(transfer.validateAmount(env.payload.amount)) {
                    let deposits = []
                    db.persons.find().toArray(function(err, persons) {
                        persons.forEach(function(person) {
                            deposits.push({ person_id: person._id, amount: env.payload.amount, when: now })
                        })
                        // create an object in transactions for each person
                        db.transactions.insertMany(deposits, function(err, result) {
                            if(!err) {
                                lib.sendJson(env.res, result.insertedIds)
                            } else {
                                lib.sendError(env.res, 400, 'Inserting transactions failed')
                            }
                        })
                    })
                } else {
                    lib.sendError(env.res, 400, 'Amount is invalid')
                }
                break
            case 'PUT':
                // transfer the amount from one account to another
                let transactionIn = { person_id: env.payload.to, amount: env.payload.amount, when: now }
                let transactionOut = { person_id: env.payload.from, amount: -env.payload.amount, when: now }
                if(transfer.validateTransaction(transactionIn) && transfer.validateTransaction(transactionOut)) {
                    // create two objects in transactions
                    db.transactions.insertMany([ transactionIn, transactionOut ], function(err, result) {
                        if(!err) {
                            lib.sendJson(env.res, result.insertedIds)
                        } else {
                            lib.sendError(env.res, 400, 'Inserting transactions failed')
                        }
                    })
                } else {
                    lib.sendError(env.res, 400, 'Wrong from, to or amount')
                }
                break        
           default:
                lib.sendError(env.res, 405, 'Method not implemented')
        }
    }
}