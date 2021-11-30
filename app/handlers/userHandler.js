module.exports = (socket) => {
    const createUser = (payload) => {
        console.log('received', payload);
        socket.broadcast.emit("user:typing", "typing...");
    }
  
    const readUser = (orderId, callback) => {
    }

    const typingUser = (payload) => {
        console.log('user:typing', payload)
        socket.broadcast.emit("user:typing", "typing...");
    }
  
    socket.on("user:create", createUser);
    socket.on("user:read", readUser);
    // socket.on("user:typing", typingUser);
}