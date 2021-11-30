const chatHandler = require("./handlers/chatHandler");
const serverHandler = require("./handlers/serverHandler");

const device = require("../types/device");
const {Device} = device;

let nextVisitorNumber = 1;

const onlineClients = new Map();
const onlineUsers = new Map()




const onNewWebsocketConnection = (socket) => {

    const connectedUserId = socket.handshake.query.userId;
    onlineClients.set(socket.id, {
        userId: connectedUserId
    });
    onlineUsers.set(connectedUserId, {
        socketId: socket.id
    });

    
    chatHandler(socket, onlineClients, onlineUsers);
    serverHandler(socket, onlineClients, onlineUsers);
    console.info(`Socket ${socket.id} has connected.`, onlineClients.size);
    // console.log('socket.user', socket.user);
    
    socket.on("connect_error", (err) => {
        console.log(err instanceof Error);
        console.log(err.message);
        console.log(err.data);
    });

    socket.on("disconnect", () => {
        var _socket = onlineClients.get(socket.id);
        onlineClients.delete(socket.id);
        onlineUsers.delete(_socket.userId);
        console.info(`Socket ${socket.id} has disconnected.`);
    });

    // socket.on("hello", helloMsg => console.info(`Socket ${socket.id} says: "${helloMsg}"`));
    // socket.emit("welcome", `Welcome! You are visitor number ${nextVisitorNumber++}`);
}

module.exports = {
	onNewWebsocketConnection,
    onlineClients,
    onlineUsers,
};