main(0)

async function main(i) {
	const elements = [
		["facebook", "antoinekahlouche", "#3b5998"],
		["github", "antoinekahlouche", "#24292e"],
		["instagram", "antoinekahlouche", "linear-gradient(90deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)"],
		["linkedin", "antoinekahlouche", "#0077b5"],
		["strava", "antoinekahlouche", "#fc4c02"],
		["tiktok", "antoinekahlouche", "linear-gradient(90deg, #69c9d0 0%, #ee1d52 100%)"],
		["twitch", "antoinekahlouche", "#9146ff"],
		["twitter", "antoinekahlouch", "#1da1f2"],
		["youtube", "...", "#ff0000"],
		["pro", "antoine.kahlouche.fr", "#e9ecef", "black"],
		["r4ce", "r4ce.co", "#c62828"]
	]

	const j = elements[i + 1] ? i + 1 : 0
	const el = elements[j]

	fade(false)
	await sleep(1000)

	replaceColor(el)
	replaceLogo(el)
	replaceText(el)

	fade(true)
	await sleep(1000)

	await sleep(15000)

	main(j)
}

function fade(inOrOut) {
	const bloc = document.getElementById("bloc")
	if (inOrOut) {
		bloc.style.animation = "fadeIn 1s"
	} else {
		bloc.style.animation = "fadeOut 1s"
	}
}

function replaceColor(el) {
	const bloc = document.getElementById("bloc")
	bloc.style.background = el[2]
	bloc.style.color = el[3] || "white"
}

function replaceLogo(el) {
	const icon = document.getElementById("icon")
	if (["r4ce", "pro"].includes(el[0])) {
		icon.innerHTML = `<img src="img/${el[0]}.png" />`
	} else {
		icon.innerHTML = `<i class="fab fa-${el[0]}"></i>`
	}
}

function replaceText(el) {
	const username = document.getElementById("username")
	username.innerHTML = el[1]
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}
