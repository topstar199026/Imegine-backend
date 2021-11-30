const   
    http = require("http"),
    express = require("express"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    cors = require("cors"),
    socketio = require("socket.io");
const user = require("./middlewares/user");
const keyUtil = require("./app/modules/keyUtil");
const ServerUtil = require("./app/modules/serverUtil");

const {generateServerKey} = keyUtil;
const {_user} = user;

function startServer() {
    require('dotenv').config();
    require('./app/modules/passportUtil')(passport);
    
    const SERVER_PORT = process.env.SERVER_PORT || '9026';
    
    const app = express();
    
    app.use(passport.initialize());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors('*'));   

    const userRoutes = require('./routes/user.route');
    app.use('/socket/', userRoutes);

    const contactRoutes = require('./routes/contact.route');
    app.use('/socket/', contactRoutes);

    const deviceRoutes = require('./routes/device.route');
    app.use('/socket/', deviceRoutes);

    const emailRoutes = require('./routes/email.route');
    app.use('/socket/', emailRoutes);

    const messageRoutes = require('./routes/message.route');
    app.use('/socket/', messageRoutes);

    const plannerRoutes = require('./routes/planner.route');
    app.use('/socket/', plannerRoutes);

    const server = http.createServer(app);
    const io = socketio(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.use((socket, next) => _user(socket, next));

    const chatHandler = require("./app/handlers/chatHandler");
    const serverHandler = require("./app/handlers/serverHandler");
    const onlineClients = new Map();
    const onlineUsers = new Map();

    // const addSocket = async (data, socket) => {
    //     console.log('socket connect request', socket.id, data)

    //     if(onlineUsers.has(data.userId)) {
    //         var _user = onlineUsers.get(data.userId);
    //         onlineClients.delete(_user.socketId);
    //     }
        
    //     onlineClients.set(socket.id, {
    //         userId: data.userId
    //     });
    //     onlineUsers.set(data.userId, {
    //         socketId: socket.id
    //     });
    // }

    const addSocket = async (data, socket) => {
        console.log('socket connect request', socket.id, data)

        if(onlineUsers.has(data.userId)) {            
            var _user = onlineUsers.get(data.userId);
            
            if(data.type === 'mobile') {
                var _i = -1;
                for(var i = 0; i < _user.length; i++){
                    var _device = _user[i];
                    if(_device.type === 'mobile'){
                        _i = i;
                    }
                }
                if(_i > -1) {
                    onlineClients.delete(_user[_i].socketId);
                    _user[_i].socketId = socket.id;
                    onlineUsers.set(data.userId, _user);
                }else{
                    _user.push({
                        socketId: socket.id,
                        deviceId: data.deviceId,
                        type: 'mobile'
                    });
                    onlineUsers.set(data.userId, _user);
                }
                onlineClients.set(socket.id, {
                    userId: data.userId,
                    deviceId: data.deviceId,
                    type: 'mobile',
                });
            }else if(data.type === 'web'){
                var _i = -1;
                for(var i = 0; i < _user.length; i++){
                    var _device = _user[i];
                    if(_device.type === 'web' && _device.deviceId === data.deviceId){
                        _i = i;
                    }
                }
                if(_i > -1) {
                    onlineClients.delete(_user[_i].socketId);
                    _user[_i].socketId = socket.id;
                    onlineUsers.set(data.userId, _user);
                }else{
                    _user.push({
                        socketId: socket.id,
                        deviceId: data.deviceId,
                        type: 'web'
                    });
                    onlineUsers.set(data.userId, _user);
                }
                onlineClients.set(socket.id, {
                    userId: data.userId,
                    deviceId: data.deviceId,
                    type: 'web',
                });
            }
        }else{
            if(data.type === 'mobile') {    
                onlineUsers.set(data.userId, [{
                    socketId: socket.id,
                    deviceId: data.deviceId,
                    type: 'mobile',
                }]);
                onlineClients.set(socket.id, {
                    userId: data.userId,
                    deviceId: data.deviceId,
                    type: 'mobile',
                });
            }else if(data.type === 'web'){
                onlineUsers.set(data.userId, [{
                    socketId: socket.id,
                    deviceId: data.deviceId,
                    type: 'web',
                }]);
                onlineClients.set(socket.id, {
                    userId: data.userId,
                    deviceId: data.deviceId,
                    type: 'web',
                });
            }
        }

        console.log(onlineClients)
        console.log(onlineUsers)
    }

    const onNewWebsocketConnection = (socket) => {
        chatHandler(io, socket, onlineClients, onlineUsers, addSocket);
        serverHandler(io, socket, onlineClients, onlineUsers, addSocket);
        socket.on("connect_error", (err) => {
            console.log(err instanceof Error);
            console.log(err.message);
            console.log(err.data);
        });    
        socket.on("disconnect", () => {
            try {             
                console.info(`Socket ${socket.id} has disconnected.`);   
                var _socket = onlineClients.get(socket.id);
                onlineClients.delete(socket.id);
                var _user = onlineUsers.get(_socket.userId);
                
                var _i = -1;
                for(var i = 0; i < _user.length; i++){
                    var _device = _user[i];
                    if(_socket.type === 'mobile' && _device.type === _socket.type){
                        _i = i;
                    }else if(_socket.type === 'web' && _device.type === _socket.type && _socket.deviceId === _device.deviceId){
                        _i = i;
                    }
                }

                if(_i > -1) {
                    _user.splice(_i, 1);
                }

                if(_user.length > 0) {
                    onlineUsers.set(_socket.userId, _user);
                }else{
                    onlineUsers.delete(_socket.userId);
                }
                console.log(onlineClients)
                console.log(onlineUsers)
            } catch (error) {
                
            }
        });
    }

    io.on("connection", onNewWebsocketConnection);

    generateServerKey();



    server.listen(SERVER_PORT, () => console.info(`Listening on port ${SERVER_PORT}.`));

    
    setTimeout(() => {
        ServerUtil.socketConnect();
    }, 4000);
    // let secondsSinceServerStarted = 0;

    // false && setInterval(() => {
    //     secondsSinceServerStarted++;
    //     console.log(secondsSinceServerStarted, onlineClients)
    //     io.emit("seconds", secondsSinceServerStarted);
    //     io.emit("online", onlineClients.size);
    // }, 1000);
}

startServer();