const socket = require("./socket.js")
const { alert, event } = require("./enum.js")
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const brands = {
	antoinekahlouche: { icon: "antoinekahlouche", title: "https://antoine.kahlouche.fr", message: "Website" },
	facebook: { icon: "facebook", title: "@r4ce", message: "Advancement & Answer questions" },
	github: { icon: "github", title: "@antoinekahlouche", message: "Code" },
	instagram: { icon: "instagram", title: "@r4ce.co", message: "Daily & Backstage & Announcement" },
	linkedin: { icon: "linkedin", title: "@antoinekahlouche", message: "Tech & Business subject" },
	r4ce: { icon: "r4ce", title: "https://r4ce.co", message: "Website" },
	soundcloud: { icon: "soundcloud", title: "@r4ce", message: "Podcast" },
	strava: { icon: "strava", title: "@antoinekahlouche", message: "Sport" },
	twitch: { icon: "twitch", title: "@antoinekahlouche", message: "Live" },
	twitter: { icon: "twitter", title: "@r4ceco", message: "Announcement" },
	youtube: { icon: "youtube", title: "@r4ce", message: "VOD & Video produite & How to" }
}

async function run() {
	await sleep(process.env.INFO_AWAIT)

	const id = socket.guid()
	const brand = _.sample(brands)
	socket.emit(event.openAlert, {
		id,
		type: alert.info,
		icon: brand.icon,
		title: `<b>${brand.title}</b>`,
		message: brand.message
	})

	await sleep(process.env.INFO_DURATION)

	socket.emit(event.closeAlert, { id })

	run()
}

module.exports = { run }
