// express를 사용하여 application을 만들고, 그것을 http 위에 올리는 과정.
// 이후 http 위에서 동작할 socket.io를 호출하여 기능을 정의했다.
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// index.html을 준다.
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// io의 기능을 정의한다.
io.on("connection", (socket) => {
    // 새로 입장한 User가 있는 경우
    console.log("a user connected. : ", socket.id);
    socket.broadcast.emit("Someone connected.");

    // 퇴장한 User가 있는 경우
    socket.on("disconnect", () => {
        console.log("A user disconnected.");
        socket.broadcast.emit("Someone disconnected.");
    });

    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });
});

// 연결을 위해 port 3000을 열어주었다.
http.listen(3000, () => {
    console.log("listening on *:3000");
});
