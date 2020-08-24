const fs = require("fs")
const express = require("express")
const app = express()
const socket = require("./src/socket.js")
const twitch = require("./src/twitch.js")
const info = require("./src/info.js")
const historic = require("./src/historic.js")

require("dotenv").config()
global._ = require("lodash")

app.use(express.static(__dirname + "/public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get("/", (req, res) => {
	res.send(render("dashboard"))
})

app.get("/key", (req, res) => {
	res.send(render("overlay", { title: "Key", style: "key" }))
})

app.get("/fill", (req, res) => {
	res.send(render("overlay", { title: "Fill" }))
})

app.get("/chroma", (req, res) => {
	res.send(render("overlay", { title: "Chroma", style: "chroma" }))
})

app.get("/historic", (req, res) => {
	res.send(historic.get())
})

app.post("/onlyProInfo", (req, res) => {
	info.onlyPro.set(req.body.value)
	res.end()
})

app.get("/onlyProInfo", (req, res) => {
	res.send(info.onlyPro.get())
})

function render(view, data = {}) {
	const title = _.capitalize(view) + (data && data.title ? " : " + data.title : "")
	const style = data && data.style ? fs.readFileSync(__dirname + "/" + view + "/" + data.style + ".css") : ""
	const script = fs.readFileSync(__dirname + "/" + view + "/index.js")
	return _.template(fs.readFileSync(__dirname + "/" + view + "/index.html"))({ title, style, script })
}

const http = socket.create(app)
twitch.create()
info.run()

http.listen(process.env.PORT)
