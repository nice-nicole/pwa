const mongodb = require('mongodb')
// const person = require('./person')
// const group = require('./group')

const db = module.exports = {

    persons: null,
    transactions: null,
    users: null,
    groups: null,
    chats: null,

    ObjectId: function(_idStr) {
        try {
            return mongodb.ObjectId(_idStr)
        } catch(ex) {
            return null
        }
    },

    init: function(nextTick) {
        mongodb.MongoClient.connect('mongodb+srv://nice-nicole:MongoDb2022@cluster0.vdy5r.mongodb.net/test', { useUnifiedTopology: true }, function(err, connection) {
            if(err) {
                console.error('Connection to database failed')
                process.exit(0)
            }
            let conn = connection.db('pwa2021')
            db.persons = conn.collection('persons')
            db.transactions = conn.collection('transactions')
            db.users = conn.collection('users')
            db.groups = conn.collection('groups')
            db.chats = conn.collection('chats')
            nextTick()
        })
    }
}