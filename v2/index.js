main(0)

async function main(i) {
	const elements = [
		{ name: "facebook", username: "antoinekahlouche", background: "#3b5998", color: "white" },
		{ name: "github", username: "antoinekahlouche", background: "#24292e", color: "white" },
		{ name: "instagram", username: "antoinekahlouche", background: "linear-gradient(90deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)", color: "white" },
		{ name: "linkedin", username: "antoinekahlouche", background: "#0077b5", color: "white" },
		{ name: "strava", username: "antoinekahlouche", background: "#fc4c02", color: "white" },
		// { name: "tiktok", username: "antoinekahlouche", background: "linear-gradient(90deg, #69c9d0 0%, #ee1d52 100%)", color: "white" },
		// { name: "twitch", username: "antoinekahlouche", background: "#9146ff", color: "white" },
		{ name: "twitter", username: "antoinekahlouch", background: "#1da1f2", color: "white" },
		// { name: "youtube", username: "...", background: "#ff0000", color: "white", border: "#9e0000" },
		{ name: "pro", username: "antoine.kahlouche.fr", background: "#e9ecef", color: "black" },
		{ name: "r4ce", username: "r4ce.co", background: "#c62828", color: "white" }
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
	bloc.style.background = el.background
	bloc.style.color = el.color
}

function replaceLogo(el) {
	const icon = document.getElementById("icon")
	if (el.name === "r4ce") {
		icon.innerHTML = `<img src="img/r4ce.png" />`
	} else if (el.name === "pro") {
		icon.innerHTML = `<i class="fas fa-link"></i>`
	} else {
		icon.innerHTML = `<i class="fab fa-${el.name}"></i>`
	}
}

function replaceText(el) {
	const username = document.getElementById("username")
	username.innerHTML = el.username
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}
