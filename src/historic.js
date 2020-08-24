const { event } = require("./enum.js")
let alerts = {}

function get() {
	return alerts
}

function push(eventName, payload) {
	if (payload.type === "MSG") return
	if (payload.type === "INFO") return
	switch (eventName) {
		case event.openAlert:
			alerts[payload.id] = payload
			break
		case event.closeAlert:
			delete alerts[payload.id]
			break
	}
}

module.exports = { get, push }
