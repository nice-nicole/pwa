const lib = require('./lib')
const db = require('./db')

const group = module.exports = {
  
    validate: function(group) {
        let groupFixed = { groupName: group.groupName }
        if(groupFixed.groupName) {
            return groupFixed
        } else {
            return null
        }
    },

    sendData: function(res) {
        db.groups.aggregate([  
            { $match: { group_id: _id } },
            { $sort: { when: -1 } }
        ]).toArray(function(err, data) {
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
                group.sendData(env.res)
                break
            case 'POST':
                let newGroup = group.validate(env.payload)
                if(newGroup) {
                    newGroup.balance = 0
                    db.groups.insertOne(newGroup, function(err, res) {
                        if(!err) {
                            lib.broadcast({ source: env.session, event: 'change', collection: 'groups' })
                            group.sendData(env.res)
                        } else {
                            lib.sendError(env.res, 400, 'Creating new object failed')
                        }
                    })
                } else {
                    lib.sendError(env.res, 400, 'Group data is invalid')
                }
                break
            case 'PUT':
                let modifiedGroup = group.validate(env.payload)
                if(modifiedGroup) {
                    db.groups.findOneAndUpdate({ _id: _id }, { $set: modifiedGroup }, function(err, res) {
                        if(!err) {
                            lib.broadcast({ source: env.session, event: 'change', collection: 'groups' })
                            group.sendData(env.res)
                        } else {
                            lib.sendError(env.res, 400, 'Updating object ' + _id + ' failed')
                        }
                    })
                } else {
                    lib.sendError(env.res, 400, 'Group data is invalid')
                }
                break        
            case 'DELETE':
                db.groups.findOneAndDelete({ _id: _id }, function(err, res) {
                    if(!err) {
                        lib.broadcast({ source: env.session, event: 'change', collection: 'groups' })
                        group.sendData(env.res)
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