const SOCKET_SERVER = 'ws://127.0.0.1:443';

const { io } = require("socket.io-client");

var mySocket = io(SOCKET_SERVER, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 2000,
});

const socketConnect = () => {
    mySocket.connect();

    mySocket.on('connect', () => {
        console.log('myServerSocket', mySocket.id)                    
    });
}

const emailNotification = async (data, currentDate, newEmail, userId) => {
    mySocket.emit("email:send", {
        data: data,
        currentDate: currentDate,
        newEmail: newEmail,
        userId: userId,
    });
}

const plannerNotification = async (userId) => {
    mySocket.emit("planner:send", {
        userId: userId,
    });
}

module.exports = {
    socketConnect,
    emailNotification,
    plannerNotification,
}