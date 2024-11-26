import { createServer } from "http";
import { Server } from "socket.io"
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "https://fe-rmrbd.vercel.app",
        methods: ["GET", "POST"], // Ensure CORS methods are allowed
    },
});
const PORT = process.env.PORT || 3000; // Lấy cổng từ môi trường, nếu không có sẽ dùng cổng 3000


let databaseUsers = [];

// Adds a new user to the databaseUsers array, ensuring no duplicates based on username
const addNewUser = (username, socketId) => {
    // Check if the user already exists
    const existingUser = databaseUsers.find(user => user.username === username);
    
    if (existingUser) {
        // Update the existing user's socketId if needed
        existingUser.socketId = socketId;
    } else {
        // Add new user if not found
        databaseUsers.push({ username, socketId });
        console.log("db:",databaseUsers)
    }
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


httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});