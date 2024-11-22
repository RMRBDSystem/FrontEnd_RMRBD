import { createServer } from "http";
import { Server } from "socket.io"
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173", // Remove "/home" to allow the entire origin
        methods: ["GET", "POST"], // Ensure CORS methods are allowed
    },
});
let databaseUsers = [];

const addNewUser = (username, socketId) => {
    // Tìm index của username trong danh sách
    const userIndex = databaseUsers.findIndex((user) => user.username === username);

    // Nếu username đã tồn tại, xóa user cũ
    if (userIndex !== -1) {
        databaseUsers.splice(userIndex, 1);
    }

    // Thêm user mới
    databaseUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
    databaseUsers = databaseUsers.filter((user) => user.socketId !== socketId);
}

const getUser = (username) => {
    return databaseUsers.find((user) => user.username === username);
}

io.on("connection", (socket) => {
    socket.on("newUser", (username) => {
        addNewUser(username, socket.id);

    });
    socket.on("sendNotification", ({ senderName, receiverName, content }) => {
        const receiver = getUser(receiverName);
        if (receiver) {
            const targetSocketId = receiver.socketId;
            io.to(targetSocketId).emit("getNotification", {
                senderName,
                content,
            });
            console.log(`Notification sent from ${senderName} to ${receiverName}`);
        } else {
            console.log(`User not found: ${receiverName}`);
        }
    })

    socket.on("disconnect", () => {
        removeUser(socket.id);
    });
});

httpServer.listen(3000);