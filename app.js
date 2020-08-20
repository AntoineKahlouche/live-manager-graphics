const _ = require("lodash")
const fs = require("fs")
const express = require("express")
const app = express()
const http = require("http").createServer(app)
const io = require("socket.io")(http)
const tmi = require("tmi.js")
require("dotenv").config()

app.use(express.static(__dirname + "/icon"))
app.use(express.static(__dirname + "/public"))
app.use(express.static(__dirname + "/script"))
app.use(express.static(__dirname + "/style"))

app.get("/", async (req, res) => {
	res.sendFile(__dirname + "/view/dashboard.html")
})
app.get("/key", async (req, res) => {
	res.send(render("view/overlay.html", { title: "Key", style: `<link rel="stylesheet" href="key.css" />` }))
})
app.get("/fill", async (req, res) => {
	res.send(render("view/overlay.html", { title: "Fill", style: `` }))
})
app.get("/chroma", async (req, res) => {
	res.send(render("view/overlay.html", { title: "Chroma", style: `<link rel="stylesheet" href="chroma.css" />` }))
})

emit()
const openAlert = []
const closeAlert = []
function emit() {
	setTimeout(function () {
		if (closeAlert.length !== 0) {
			io.emit("closeAlert", closeAlert.shift())
		} else if (openAlert.length !== 0) {
			io.emit("openAlert", openAlert.shift())
		}
		emit()
	}, 1000)
}

io.on("connection", socket => {
	socket.on("openAlert", data => {
		openAlert.push(data)
	})
	socket.on("closeAlert", data => {
		closeAlert.push(data)
	})
	socket.on("sendMessage", data => {
		// TODO call tmi
	})
})

http.listen(process.env.PORT)

function render(view, params = {}) {
	return _.template(fs.readFileSync(__dirname + "/" + view))(params)
}

const client = new tmi.Client({
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: process.env.BOT_USERNAME,
		password: process.env.OAUTH_TOKEN // https://twitchapps.com/tmi/
	},
	channels: ["melina", "ponce", "mastersnakou", "trinity", "nutty", "ultia", "cheriekitten"] // process.env.CHANNEL_NAME
})
client.connect().catch(console.error)

// https://github.com/tmijs/docs/blob/gh-pages/_posts/v1.4.2/2019-03-03-Events.md

// MSG -----------------------------------------------------------
// client.on("chat", (channel, userstate, message, self) => {
// 	if (self) return
// 	io.emit("openMessage", {
// 		title: `<b>${userstate.username}</b>`,
// 		message: displayMessage(message)
// 	})
// })

// BIT -----------------------------------------------------------
client.on("cheer", (channel, userstate, message) => {
	io.emit("openAlert", {
		type: "bit",
		id: Date.now(),
		title: `<b>${userstate.username}</b> : ${userstate.bits} bits`,
		message: displayMessage(message)
	})
})

// SUB -----------------------------------------------------------
client.on("resub", (channel, username, months, message, userstate, methods) => {
	let cumulativeMonths = ~~userstate["msg-param-cumulative-months"]
	io.emit("openAlert", {
		type: "sub",
		id: Date.now(),
		title: `<b>${username}</b> : Sub ${cumulativeMonths} mois`,
		message: displayMessage(message)
	})
})
client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
	let senderCount = ~~userstate["msg-param-sender-count"]
	io.emit("openAlert", {
		type: "sub",
		id: Date.now(),
		title: `<b>${username}</b> : ${senderCount} gifted sub`
	})
})
client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
	let senderCount = ~~userstate["msg-param-sender-count"]
	io.emit("openAlert", {
		type: "sub",
		id: Date.now(),
		title: `<b>${username}</b> : ${senderCount} gifted sub`
	})
})
client.on("subscription", (channel, username, method, message, userstate) => {
	io.emit("openAlert", {
		type: "sub",
		id: Date.now(),
		title: `<b>${username}</b> : Sub`,
		message: displayMessage(message)
	})
})

// RAID -----------------------------------------------------------
client.on("hosted", (channel, username, viewers, autohost) => {
	io.emit("openAlert", {
		type: "raid",
		id: Date.now(),
		title: `<b>${username}</b> : ${viewers} ...`
	})
})
client.on("raided", (channel, username, viewers) => {
	io.emit("openAlert", {
		type: "raid",
		id: Date.now(),
		title: `<b>${username}</b> : ${viewers} raiders`
	})
})

function displayMessage(message) {
	// https://github.com/tmijs/tmi.js/issues/151
	return message
}
