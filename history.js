const lib = require('./lib')
const db = require('./db')

const history = module.exports = {
  
    sendData: function(res, _id) {
        db.transactions.aggregate([
            { $match: { person_id: _id } },
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
                history.sendData(env.res, _id)
                break
           default:
                lib.sendError(env.res, 405, 'Method not implemented')
        }
    }
}