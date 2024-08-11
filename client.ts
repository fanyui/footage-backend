const { io } = require("socket.io-client");

const socket = io("ws://127.0.0.1:8080", {
    reconnectionDelayMax: 10000,
    auth: {
        token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzNmU3NWQyMC1lNGVlLTRiYjktYjBhOS1iYThmNDdkYTEyMWYiLCJlbWFpbCI6ImpvaG5kb2VAZ21haWwuY29tIiwiZmlyc3ROYW1lIjoiSm9obiIsImxhc3ROYW1lIjoiRG9lIiwiaWF0IjoxNzE1ODY0Njc4LCJleHAiOjE3MTU4NjUxOTh9.LUSvQyuN6-Yn71k1PsY05NhQWfIcSFihcLIyQ0oir84"
    },
    query: {
        "my-key": "my-value"
    }
});
socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("message", "Hello from client");
    socket.on("message", (data) => {
        console.log(" got dataa", data);
    })
})

socket.on("disconnect", () => {
    console.log("Disconnected from server");
})



socket.on("error", (error) => {
    console.error(error);
})

