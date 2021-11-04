const person = module.exports = {

    data: [
        { firstName: 'Mariusz', lastName: 'Jarocki', year: 1969 },
        { firstName: 'John', lastName: 'Doe', year: 2000 }
    ],
    
    handle: function(env) {
        let n = parseInt(env.urlParsed.query.n)
        if((env.req.method == 'PUT' || env.req.method == 'DELETE') && isNaN(n) || n < 0 || n >= person.data.length) {
            env.res.writeHead(400, 'Bad index', {'Content-type': 'application/json'})
            env.res.end()            
            return
        }
        switch(env.req.method) {
            case 'GET':
                env.res.writeHead(200, 'OK', {'Content-type': 'application/json'})
                env.res.write(JSON.stringify(person.data))
                env.res.end()
                break
            case 'POST':
                person.data.push(env.payload)
                env.res.writeHead(200, 'OK', {'Content-type': 'application/json'})
                env.res.write(JSON.stringify(person.data))
                env.res.end()  
                break
            case 'PUT':
                person.data[n] = env.payload
                env.res.writeHead(200, 'OK', {'Content-type': 'application/json'})
                env.res.write(JSON.stringify(person.data))
                env.res.end()  
                break        
            case 'DELETE':
                person.data.splice(n, 1)
                env.res.writeHead(200, 'OK', {'Content-type': 'application/json'})
                env.res.write(JSON.stringify(person.data))
                env.res.end()
                break    
           default:
                env.res.writeHead(405, 'Method not allowed', {'Content-type': 'application/json'})
                env.res.end()
        }
    }
}