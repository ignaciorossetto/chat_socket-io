import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from './routes/views.router.js'

// instancia express
const app = express()

// creacion del servidor http
const PORT = 8080
const httpServer = app.listen(PORT, ()=> console.log(`Listening on port ${PORT}`))

// instancia y creacion del servidor socket (no arranco aun)
const io = new Server(httpServer)

// configuracion del engine que vamos a utilizar para las views
app.engine('handlebars',  handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// configuracion de la carpeta static
app.use(express.static(__dirname + '/public'))

// configuracion de rutas
app.use('/', viewsRouter)

// configuracion del servidor socket

let messages = []

// aca abro la conexion con el front, con .emits le paso info y con socket.on escucho, con io.to(socket.id).emit me comunico solo on el sender del socket.
io.on('connection', (socket) => {
    


    socket.on('authenticated', data => {
        console.log(`New client ${data} connected`);
        socket.broadcast.emit("userLoggedIn", {
            user: data,
            mjs: messages
        })
        io.to(socket.id).emit('messagesArray', messages)
        console.log(socket.id);
    })


    socket.on('message', data => {
        messages.push(data)
        io.emit('messageLogs', messages)
    })
}
)

