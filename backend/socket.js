const initializeSocket = (io) => {
    //// when a new client (user) connects.
    io.on('connection', (socket) => {
        console.log(`[Socket.IO] A user connected: ${socket.id}`)

        // --- Register all event handlers for this socket ---

        //Handle disconnection
        socket.on('disconnect', () => {
            console.log(`[Socket.IO] User disconnected: ${socket.id}`)
            // In the future, we'll notify others in the room
        })

        //Handle code changes
        socket.on('code-change', (data) => {
            // 'data' will likely contain { roomId, newCode }
            console.log(`[Code Change] User ${socket.id} is typing...`)

            // We will broadcast this to everyone *except* the sender
            socket.broadcast.emit('code-updated', data)
        })

        //Handle chat messages
        socket.on('chat-message', (data) => {
            // 'data' will likely contain { roomId, message, user }
            console.log(`[Chat] Message from ${socket.id}: ${data.message}`)
            // We broadcast this to *everyone* including the sender
            io.emit('chat-message-received', data)
        })

        // --- More handlers will go here ---
        // socket.on('join-room', (roomId) => { ... });
        // socket.on('video-signal', (data) => { ... });
    })
}

module.exports = initializeSocket
