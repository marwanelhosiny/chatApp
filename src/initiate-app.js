import * as routes from './modules/routes.js'
import db_connection from '../DB/connection.js'
import { globalResponse } from '../src/middlewares/globalResponse.js'


import cors from 'cors'
import { Server } from 'socket.io'
import path from "path"


export const initiateApp = (express, app) => {


    const port = process.env.PORT
    db_connection()


    app.use(cors())
    app.use(express.json())
    app.use('/user', routes.userRouter)
    app.use('/chat', routes.chatRouter)
    app.use('/message', routes.messageRouter)

    app.use(globalResponse)

    //Deployment

        if (process.env.NODE_ENV === 'production') {
            const __dirname1 = path.resolve()
            app.use(express.static(path.join(__dirname1, 'client/build')))
            app.get('*', (req, res) => {
                res.sendFile(path.resolve(__dirname1, "client/build/index.html"))
            })
        } else {
            app.get('/', (req, res) => {
                res.send('chat app is running..')
            })
        }
    

    const expressServer = app.listen(port, () => console.log(`app listening on port 5000!`))
    const io = new Server(expressServer, {
        cors: '*',
    })
    io.on('connection', (socket) => {
        console.log('a client connected', { id: socket.id });
        socket.on("setup", (userData) => {
            socket.join(userData._id)
            console.log("user joined room", userData._id)
            socket.emit("connected")
        })

        socket.on("joinChat", (room) => {
            socket.join(room)
        })

        socket.on("typing", (room) => socket.in(room).emit("typing"))
        socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))


        socket.on("newMessage", (newMessageRecieved) => {
            console.log(newMessageRecieved)
            let chat = newMessageRecieved.chat
            if (!chat.users) return console.log('chat is empty')

            chat.users.forEach(user => {
                if (user._id === newMessageRecieved.sender._id) {
                    return;
                }
                socket.in(user._id).emit('messageRecieved', newMessageRecieved)
            })
        })


    });
}