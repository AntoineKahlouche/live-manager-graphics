const { event } = require("./enum.js")
const historic = require("./historic.js")
let io

function create(app) {
	const http = require("http").createServer(app)
	io = require("socket.io")(http)

	io.on("connection", socket => {
		socket.on(event.closeAlert, data => {
			emit(event.closeAlert, data)
		})
		socket.on(event.sendMessage, data => {
			// TODO twitch.send(data)
		})
	})

	return http
}

function emit(eventName, data) {
	if (!io) return
	const payload = {
		id: data.id || guid(),
		...data
	}
	io.emit(eventName, payload)
	historic.push(eventName, payload)
}

function guid() {
	return (
		Date.now() +
		Math.floor((1 + Math.random()) * 0x100000000000000)
			.toString(36)
			.substring(1)
	)
}

module.exports = { create, emit, guid }
