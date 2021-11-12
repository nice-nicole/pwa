const mongodb = require('mongodb')
const person = require('./person')

const db = module.exports = {

    persons: null,

    ObjectId: function(_idStr) {
        try {
            return mongodb.ObjectId(_idStr)
        } catch(ex) {
            return null
        }
    },

    init: function(nextTick) {
        mongodb.MongoClient.connect('mongodb://localhost', { useUnifiedTopology: true }, function(err, connection) {
            if(err) {
                console.error('Connection to database failed')
                process.exit(0)
            }
            let conn = connection.db('pwa2021')
            db.persons = conn.collection('persons')
            nextTick()
        })
    }
}