const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const initializeSocket = require('./socket')

const app = express()

//cors
app.use(cors())

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    },
})

initializeSocket(io)

const PORT = process.env.PORT || 8000
app.get('/check', (req, res) => {
    res.status(200).end('Server running...')
})

httpServer.listen(8000, () => {
    console.log(`[Server] Listening on port ${PORT}`)
})
