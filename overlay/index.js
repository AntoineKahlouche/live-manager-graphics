$(() => {
	const socket = io()
	socket.on("OPEN_ALERT", function (data) {
		if (data.type === "MSG") return
		open(data)
	})
	socket.on("CLOSE_ALERT", function (data) {
		close(data)
	})

	init()
})

async function init() {
	for (const data of Object.values((await axios.get("/historic")).data)) {
		open(data)
	}
}

// Alert for fill path
const gunshot = new Audio("gunshot.mp3")
function playSound() {
	if (window.location.pathname !== "/fill") return
	var isPlaying = gunshot.currentTime > 0 && !gunshot.paused && !gunshot.ended && gunshot.readyState > 2

	if (isPlaying) {
		gunshot.pause()
		gunshot.currentTime = 0
	}
	gunshot.play()
}

// Lofi for key path
let player
function onYouTubeIframeAPIReady() {
	if (window.location.pathname !== "/key") return
	player = new YT.Player("player", {
		height: "390",
		width: "640",
		videoId: "5yx6BWlEVcY",
		events: {
			onReady: event => {
				event.target.setVolume(100)
				event.target.playVideo()
			}
		}
	})
}

function open(data) {
	const functionName = _.toLower(data.type)
	const html = window[functionName](data)
	$("body").append(html)
	const alert = $(`#${data.id}`)

	let top = 1080
	$(".alert:not(.animate__fadeOutLeft)").map(function () {
		top -= $(this).outerHeight(true)
	})

	alert.css({ top })

	alert.addClass("animate__fadeInLeft")

	playSound()
}

function close(data) {
	const alert = $(`#${data.id}`)
	alert.addClass("animate__fadeOutLeft")

	let top = 1080
	$(".alert:not(.animate__fadeOutLeft)").map(function () {
		top -= $(this).outerHeight(true)
		$(this).css({
			top,
			transition: "top 1s ease-in"
		})
	})

	playSound()

	setTimeout(() => {
		alert.alert("close")
	}, 1000)
}

function info(data) {
	const icon = _.includes(["r4ce", "antoinekahlouche"], data.icon) //
		? `<div><img class="mr-4 animate__animated animate__wobble animate__infinite" src="/${data.icon}.png" height="36px" /></div>`
		: `<i class="fab fa-2x fa-${data.icon} mr-4 animate__animated animate__wobble animate__infinite"></i>`
	return `
		<div id="${data.id}" class="alert alert-warning d-flex align-items-center animate__animated" role="alert">
			${icon}
			<div class="hidden">
				${data.title}<br />
				${data.message}
			</div>
		</div>
	`
}

function bit(data) {
	return `
		<div id="${data.id}" class="alert alert-primary d-flex align-items-center animate__animated" role="alert">
			<i class="fas fa-2x fa-heart mr-4 animate__animated animate__heartBeat animate__infinite"></i>
			<div class="hidden">
				${data.title}
				${data.message ? "<br />" + data.message : ""}
			</div>
		</div>
	`
}

function sub(data) {
	return `
		<div id="${data.id}" class="alert alert-success d-flex align-items-center animate__animated" role="alert">
			<i class="fas fa-2x fa-fire mr-4 animate__animated animate__rubberBand animate__infinite"></i>
			<div class="hidden">
				${data.title}
				${data.message ? "<br />" + data.message : ""}
			</div>
		</div>
	`
}

function raid(data) {
	return `
		<div id="${data.id}" class="alert alert-danger d-flex align-items-center animate__animated" role="alert">
			<i class="fas fa-2x fa-bolt mr-4 animate__animated animate__shakeY animate__infinite"></i>
			<div class="hidden">
				${data.title}
			</div>
		</div>
	`
}
