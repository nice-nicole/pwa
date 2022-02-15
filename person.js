const lib = require('./lib')
const db = require('./db')

const person = module.exports = {
  
    validate: function(person) {
        let personFixed = { firstName: person.firstName, lastName: person.lastName, year: person.year, group_id: db.ObjectId(person.group_id) }
        if(personFixed.firstName && personFixed.lastName && personFixed.year >= 1500) {
            return personFixed
        } else {
            return null
        }
    },

    sendData: function(res) {
        db.persons.aggregate([{
            $lookup: {
                from: 'transactions',
                localField: '_id',
                foreignField: 'person_id',
                as: 'transactions',
            }},{
                $lookup: {  
                    from: 'groups',
                localField: 'group_id',
                foreignField: '_id',
                as: 'groups'
            } 
        }, {
            $unwind: '$groups' 
        },{
            $addFields: {
                balance: { $sum: '$transactions.amount' },
                groupName: '$groups.groupName'
            }
        }, {
            $project: {
                transactions: false, 
                groups: false               
            }
        }]).toArray(function(err, data) {
            if(!err) 
                lib.sendJson(res, data)
            else
                lib.sendError(res, 400, err.message)
        })    
    },
    handle: function(env) {
        let _id = db.ObjectId(env.urlParsed.query._id)
        switch(env.req.method) {
            case 'GET':
                person.sendData(env.res)
                break
            case 'POST':
                let newPerson = person.validate(env.payload)
                if(newPerson) {
                    // newPerson.balance = 0
                    db.persons.insertOne(newPerson, function(err, res) {
                        if(!err) {
                            lib.broadcast({ source: env.session, event: 'change', collection: 'persons' })
                            person.sendData(env.res)
                        } else {
                            lib.sendError(env.res, 400, 'Creating new object failed')
                        }
                    })
                } else {
                    lib.sendError(env.res, 400, 'Person data is invalid')
                }
                break
            case 'PUT':
                let modifiedPerson = person.validate(env.payload)
                if(modifiedPerson) {
                    db.persons.findOneAndUpdate({ _id: _id }, { $set: modifiedPerson }, function(err, res) {
                        if(!err) {
                            lib.broadcast({ source: env.session, event: 'change', collection: 'persons' })
                            person.sendData(env.res)
                        } else {
                            lib.sendError(env.res, 400, 'Updating object ' + _id + ' failed')
                        }
                    })
                } else {
                    lib.sendError(env.res, 400, 'Person data is invalid')
                }
                break        
            case 'DELETE':
                db.persons.findOneAndDelete({ _id: _id }, function(err, res) {
                    if(!err) {
                        lib.broadcast({ source: env.session, event: 'change', collection: 'persons' })
                        person.sendData(env.res)
                    } else {
                        lib.sendError(env.res, 400, 'Deleting object ' + _id + ' failed')
                    }
                })
                break    
           default:
                lib.sendError(env.res, 405, 'Method not implemented')
        }
    }
}