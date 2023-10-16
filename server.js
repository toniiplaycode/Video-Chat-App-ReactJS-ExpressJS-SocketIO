import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'htpp://localhost:3000', 
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    socket.emit("me", socket.id);

    socket.on("disconnect", () => { // lắng nghe sự kiện ngắt kết nối và thực hiện callback 
        socket.broadcast.emit("callEnded"); // gửi sự kiện callEnded đến tất cả các máy khách khác, trừ kết nối gốc
    });

    socket.on("callUser", (data) => { // lắng nghe sự kiện gọi người khác và thực hiện callback
        io.to(data.userToCall).emit("callUser", {signal: data.signalData, from: data.from, name: data.name}); // gửi sự kiện đến phòng data.userToCall kèm theo dữ liệu (tạo cuộc gọi giữa người dùng)
    });

    socket.on("answerCall", (data) => { // chấp nhận cuộc gọi
        io.to(data.to).emit("callAccepted", data.signal); // gửi sự kiện đến phòng data.to kèm theo dữ liệu
    });

});


server.listen(5000, () => {
    console.log("Server is running on port 5000 !");
});
