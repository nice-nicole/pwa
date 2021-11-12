const lib = require('./lib')
const db = require('./db')

const person = module.exports = {

    // temporarily
    data: [],
    
    validate: function(person) {
        let personFixed = { firstName: person.firstName, lastName: person.lastName, year: person.year }
        if(personFixed.firstName && personFixed.lastName && personFixed.year >= 1900) {
            return personFixed
        } else {
            return null
        }
    },

    sendData: function(res) {
        db.persons.find().toArray(function(err, data) {
            if(!err) 
                lib.sendJson(res, data)
            else
                lib.sendError(res, 400, err.message)
        })    
    },

    handle: function(env) {
        let n = parseInt(env.urlParsed.query.n)
        if((env.req.method == 'PUT' || env.req.method == 'DELETE') && isNaN(n) || n < 0 || n >= person.data.length) {
            lib.sendError(env.res, 400, 'Bad index (' + n + ')')
            return
        }
        switch(env.req.method) {
            case 'GET':
                person.sendData(env.res)
                break
            case 'POST':
                let newPerson = person.validate(env.payload)
                if(newPerson) {
                    newPerson.balance = 0
                    person.data.push(newPerson)
                    lib.sendJson(env.res, person.data)    
                } else {
                    lib.sendError(env.res, 400, 'Person data is invalid')
                }
                break
            case 'PUT':
                let prevBalance = person.data[n].balance
                let modifiedPerson = person.validate(env.payload)
                if(modifiedPerson) {
                    person.data[n] = modifiedPerson
                    person.data[n].balance = prevBalance
                    lib.sendJson(env.res, person.data)
                } else {
                    lib.sendError(env.res, 400, 'Person data is invalid')
                }
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