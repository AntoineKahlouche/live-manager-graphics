const socket = require("./socket.js")
const { alert, event } = require("./enum.js")
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const onlyPro = {
	val: false,
	get: () => onlyPro.val,
	set: value => (onlyPro.val = value)
}

const brands = {
	pro: {
		website: { icon: "r4ce", title: "https://r4ce.co", message: "Website" },
		facebook: { icon: "facebook", title: "@r4ce", message: "Advancement & Answer questions" },
		instagram: { icon: "instagram", title: "@r4ce.co", message: "Daily & Backstage & Announcement" },
		soundcloud: { icon: "soundcloud", title: "@r4ce", message: "Podcast" },
		twitter: { icon: "twitter", title: "@r4ceco", message: "Announcement" },
		youtube: { icon: "youtube", title: "@r4ce", message: "VOD & Video produite & How to" }
	},
	perso: {
		website: { icon: "antoinekahlouche", title: "https://antoine.kahlouche.fr", message: "Website" },
		github: { icon: "github", title: "@antoinekahlouche", message: "Code" },
		linkedin: { icon: "linkedin", title: "@antoinekahlouche", message: "Tech & Business subject" },
		patreon: { icon: "patreon", title: "@antoinekahlouche", message: "Support" },
		strava: { icon: "strava", title: "@antoinekahlouche", message: "Sport" },
		twitch: { icon: "twitch", title: "@antoinekahlouche", message: "Live" }
	}
}

async function run() {
	await sleep(process.env.INFO_AWAIT)

	const id = socket.guid()
	const brand = _.sample(onlyPro.val ? brands.pro : _.concat(_.values(brands.pro), _.values(brands.perso)))
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

module.exports = { run, onlyPro }
