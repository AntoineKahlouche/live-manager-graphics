const _ = require("lodash")
const fs = require("fs")
const express = require("express")
const app = express()
const http = require("http").createServer(app)
const io = require("socket.io")(http)

app.use(express.static(__dirname + "/style"))
app.use(express.static(__dirname + "/script"))
app.use(express.static(__dirname + "/icon"))

app.get("/", async (req, res) => {
	// TODO
})
app.get("/key", async (req, res) => {
	res.send(render("index.html", { style: `<link rel="stylesheet" href="key.css" />` }))
})
app.get("/fill", async (req, res) => {
	res.send(render("index.html", { style: `` }))
})
app.get("/chroma", async (req, res) => {
	res.send(render("index.html", { style: `<link rel="stylesheet" href="chroma.css" />` }))
})

io.on("connection", socket => {
	io.emit("alert", "hi")
})

http.listen(3000)

function render(view, params = {}) {
	return _.template(fs.readFileSync(__dirname + "/" + view))(params)
}
