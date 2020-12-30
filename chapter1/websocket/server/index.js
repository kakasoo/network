const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// index.html을 준다
// client file에 들어가도 되긴 하지만, 편의를 위해 서버에서 제공
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
    // send를 사용하거나, emit에 custom event name을 만들어 사용하면 된다.
    // 아래는 두 가지 방식으로 메시지를 전달하고 있는 예시.
    socket.send("Hello!");
    socket.emit("greetings", "Hey!", { ms: "jane" }, Buffer.from([4, 3, 3, 1]));

    socket.on("message", (data) => console.log(data));
    socket.on("salutations", (elem1, elem2, elem3) => console.log(elem1, elem2, elem3));
});

http.listen(3000, () => console.log("listening on *:3000"));
