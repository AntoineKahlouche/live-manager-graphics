const tmi = require("tmi.js")
const socket = require("./socket.js")
const { alert, event } = require("./enum.js")
const fs = require("fs")

function create() {
	const client = new tmi.Client({
		connection: {
			reconnect: true,
			secure: true
		},
		identity: {
			username: process.env.BOT_USERNAME,
			password: process.env.OAUTH_TOKEN // https://twitchapps.com/tmi/
		},
		channels: [process.env.CHANNEL_NAME]
	})
	client.connect().catch(console.error)
	listen(client)
}

function listen(client) {
	// https://github.com/tmijs/docs/blob/gh-pages/_posts/v1.4.2/2019-03-03-Events.md

	// client.on("action", (channel, userstate, message, self) => {})
	client.on("anongiftpaidupgrade", (channel, username, userstate) => {
		updateExample("anongiftpaidupgrade", { channel, username, userstate })
	})
	// client.on("ban", (channel, username, reason, userstate) => {})
	client.on("chat", (channel, userstate, message, self) => {
		if (self) return
		// console.log({ channel, userstate, message, self })
		socket.emit(event.openAlert, {
			type: alert.msg,
			title: `<b style="color:${userstate.color || "#000000"};">${userstate.subscriber ? "⭐" : ""} ${userstate.username}</b>`,
			message: displayMessage(message, userstate.emotes)
		})
	})
	client.on("cheer", (channel, userstate, message) => {
		const username = userstate.username
		const bits = userstate.bits
		const title = (username, bits) =>
			_.sample([
				`Merci à toi ${username} pour les ${bits} bits`, //
				`${username} tu déchir avec tes ${bits} bits`
			])

		socket.emit(event.openAlert, {
			type: alert.bit,
			title: `<b>${title(username, bits)}</b>`,
			message: displayMessage(message, userstate.emotes)
		})
	})
	// client.on("clearchat", channel => {})
	// client.on("connected", (address, port) => {})
	// client.on("connecting", (address, port) => {})
	// client.on("disconnected", reason => {})
	client.on("emoteonly", (channel, enabled) => {
		updateExample("emoteonly", { channel, enabled })
	})
	// client.on("emotesets", (sets, obj) => {})
	client.on("followersonly", (channel, enabled, length) => {
		updateExample("followersonly", { channel, enabled, length })
	})
	client.on("giftpaidupgrade", (channel, username, sender, userstate) => {
		updateExample("giftpaidupgrade", { channel, username, sender, userstate })
	})
	client.on("hosted", (channel, username, viewers, autohost) => {
		updateExample("hosted", { channel, username, viewers, autohost })
	})
	// client.on("hosting", (channel, target, viewers) => {})
	// client.on("join", (channel, username, self) => {})
	// client.on("logon", () => {})
	// client.on("message", (channel, userstate, message, self) => {})
	// client.on("messagedeleted", (channel, username, deletedMessage, userstate) => {})
	client.on("mod", (channel, username) => {
		updateExample("mod", { channel, username })
	})
	client.on("mods", (channel, mods) => {
		updateExample("mods", { channel, mods })
	})
	client.on("notice", (channel, msgid, message) => {
		updateExample("notice", { channel, msgid, message })
	})
	// client.on("part", (channel, username, self) => {})
	// client.on("ping", () => {})
	// client.on("pong", latency => {})
	client.on("r9kbeta", (channel, enabled) => {
		updateExample("r9kbeta", { channel, enabled })
	})
	client.on("raided", (channel, username, viewers) => {
		updateExample("raided", { channel, username, viewers })
	})
	// client.on("raw_message", (messageCloned, message) => {})
	// client.on("reconnect", () => {})
	client.on("resub", (channel, username, months, message, userstate, methods) => {
		const cumulativeMonths = ~~userstate["msg-param-cumulative-months"]
		const title = (username, cumulativeMonths) =>
			_.sample([
				`Merci à toi ${username} pour ton resub, déjà ${cumulativeMonths} mois`, //
				`${username} tu te resub depuis ${cumulativeMonths} mois et ça fait plaisir`
			])

		socket.emit(event.openAlert, {
			type: alert.sub,
			title: `<b>${title(username, cumulativeMonths)}</b>`,
			message: displayMessage(message, userstate.emotes)
		})
	})
	// client.on("roomstate", (channel, state) => {})
	client.on("serverchange", channel => {
		updateExample("serverchange", { channel })
	})
	// client.on("slowmode", (channel, enabled, length) => {})
	client.on("subgift", (channel, username, streakMonths, recipient, methods, userstate) => {
		const senderCount = ~~userstate["msg-param-sender-count"]
		const senderCountText = senderCount > 1 ? `tes ${senderCount}` : "ton"
		const title = (username, senderCountText) =>
			_.sample([
				`Merci à toi ${username} pour ${senderCountText} gifted sub`, //
				`${username}, juste merci pour ${senderCountText} gifted sub`
			])

		socket.emit(event.openAlert, {
			type: alert.sub,
			title: `<b>${title(username, senderCountText)}</b>`
		})
	})
	client.on("submysterygift", (channel, username, numbOfSubs, methods, userstate) => {
		const senderCount = ~~userstate["msg-param-sender-count"]
		const senderCountText = senderCount > 1 ? `tes ${senderCount}` : "ton"
		const title = (username, senderCountText) =>
			_.sample([
				`Merci à toi ${username} pour ${senderCountText} gifted sub`, //
				`${username}, juste merci pour ${senderCountText} gifted sub`
			])

		socket.emit(event.openAlert, {
			type: alert.sub,
			title: `<b>${title(username, senderCountText)}</b>`
		})
	})
	client.on("subscribers", (channel, enabled) => {
		updateExample("subscribers", { channel, enabled })
	})
	client.on("subscription", (channel, username, method, message, userstate) => {
		const title = username =>
			_.sample([
				`Merci à toi ${username} pour ton sub`, //
				`Bienvenue parmis nous ${username}`
			])

		socket.emit(event.openAlert, {
			type: alert.sub,
			title: `<b>${title(username)}</b>`,
			message: displayMessage(message, userstate.emotes)
		})
	})
	// client.on("timeout", (channel, username, reason, duration, userstate) => {})
	// client.on("unhost", (channel, viewers) => {})
	client.on("unmod", (channel, username) => {
		updateExample("unmod", { channel, username })
	})
	client.on("vips", (channel, vips) => {
		updateExample("vips", { channel, vips })
	})
	// client.on("whisper", (from, userstate, message, self) => {})
}

function updateExample(event, data) {
	console.log(event)
	let all
	try {
		all = require("../example/" + event + ".json")
	} catch (e) {
		all = []
	}

	all.push(data)

	fs.writeFileSync(__dirname + "/../example/" + event + ".json", JSON.stringify(all), error => {
		if (error) console.log(error)
	})
}

function displayTitle(message) {
	// https://github.com/tmijs/tmi.js/issues/151
	return message
}

function displayMessage(message, emotes) {
	var splitText = message.split("")
	for (var i in emotes) {
		var e = emotes[i]
		for (var j in e) {
			var mote = e[j]
			if (typeof mote == "string") {
				mote = mote.split("-")
				mote = [parseInt(mote[0]), parseInt(mote[1])]
				var length = mote[1] - mote[0],
					empty = Array.apply(null, new Array(length + 1)).map(function () {
						return ""
					})
				splitText = splitText
					.slice(0, mote[0])
					.concat(empty)
					.concat(splitText.slice(mote[1] + 1, splitText.length))
				splitText.splice(mote[0], 1, '<img class="emoticon" src="http://static-cdn.jtvnw.net/emoticons/v1/' + i + '/3.0">')
			}
		}
	}
	return splitText.join("")
}

function send(data) {}

module.exports = { create, send }
