const lib = require('./lib')
const db = require('./db')

const chat = module.exports = {
  
    validate: function(chat) {
        let messageFixed = { sender_id: db.ObjectId(chat.sender_id), group_id: db.ObjectId(chat.group_id), content: chat.content }
        if(messageFixed.sender_id && messageFixed.group_id && messageFixed.content) {
            return messageFixed
        } else {
            return null
        }
    },

    sendData: function(res, _id) {
        db.chats.aggregate([{
            $lookup: {
                from: 'persons',
                localField: 'sender_id',
                foreignField: '_id',
                as: 'persons'
            }
        },{
           $unwind: '$persons' 
        },{
            $addFields: {
                firstName: '$persons.firstName',
            } 
        } ,{    
            $match: { group_id: _id}       
        },{
            $sort: { when: -1 } }     
        ]).toArray(function(err, data) {
            if(!err) 
                lib.sendJson(res, data)
            else
                lib.sendError(res, 400, err.message)
        })    
    },

    handle: function(env, session, wsServer, req) {
        let _id = db.ObjectId(env.urlParsed.query._id)
        switch(env.req.method) {
            case 'GET':
                chat.sendData(env.res, _id)
                break
   
                case 'POST':                
                let now = Date.now()
                let date = new Date(now)
                date = date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
                let newChat = chat.validate(env.payload)
                console.log("newChat", newChat)
                let inputChat = { sender_id: newChat.sender_id, group_id: newChat.group_id, content: newChat.content, when: date }
                console.log("inputChat", inputChat)
                db.chats.insertOne(inputChat, function(err, res) {
                    if(!err) {
                        lib.broadcast({ source: env.session, event: 'change', collection: 'chats' })
                        chat.sendData(env.res, inputChat.group_id)
                    } else {
                        lib.sendError(env.res, 400, 'Creating new object failed')
                    }
                })
              var value = ''
              var cont = { from: session }
              req.on('value', function(unit) { value += unit; }).on('end', function() {
              cont.value = value
              var sentTo = []
              wsServer.clients.forEach(function(client) {
                  if(client.readyState == ws.OPEN && client.session != session) {
                      client.send(JSON.stringify(cont))
                      sentTo.push(client.session)
                  }
              })
              cont.sentTo = sentTo
              res.writeHead(200, 'OK', { 'Content-Type': 'application/json' })
              res.end(JSON.stringify(cont))
          })
                break
           default:
                lib.sendError(env.res, 405, 'Method not implemented')
        }
    }
}