const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const server = app.listen(3000, () => {
  console.log("server is running on port", server.address().port);
});

const io = require("socket.io").listen(server);
const bodyParser = require("body-parser");
const Message = mongoose.model("Message", { name: String, message: String });

const dbUrl =
  "mongodb+srv://rajareddy:thisiscluster@chat-6jcjo.mongodb.net/test?retryWrites=true&w=majority";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: "http://localhost:3001" }));

io.on("connection", () => {
  console.log("a user is connected");
});

mongoose.connect(dbUrl, err => {
  console.log("mongodb connected", err);
});

app.get("/messages", (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post("/messages", (req, res) => {
  var message = new Message(req.body);
  message.save(err => {
    if (err) sendStatus(500);
    io.emit("message", req.body);
    res.sendStatus(200);
  });
});
