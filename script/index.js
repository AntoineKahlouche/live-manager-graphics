// $(() => {
// 	var socket = io()
// 	socket.on("alert", function (payload) {
// 		switch (payload.action) {
// 			case "open":
// 				break

// 			case "close":
// 				break

// 			default:
// 				break
// 		}
// 	})
// })

const alerts = []
let topStackAlert = 1040
const calls = []
let loop = 0

$(() => {
	main(true)
})

function main() {
	setTimeout(function () {
		loop++

		// Animate footer
		if (loop % 30 === 0) {
			const visibleFooter = loop % 60 === 0 ? $(".antoineFooter") : $(".r4ceFooter")
			const hiddenFooter = loop % 60 !== 0 ? $(".antoineFooter") : $(".r4ceFooter")
			visibleFooter.removeClass("animate__fadeInDown")
			visibleFooter.addClass("animate__fadeOutDown")
			hiddenFooter.removeClass("animate__fadeOutDown")
			hiddenFooter.addClass("animate__fadeInDown")
		} else if (loop % 2 === 0) {
			$(".logoContainer").toggleClass("animate__headShake")
		}

		// Calls
		if (calls.length > 0) {
			const call = calls.shift()
			window[call[0]](call[1])
		}

		// Remove old alerts
		if (alerts[0] + 10 < loop) close("0")

		// Recursif
		main()
	}, 1000)
}

function open(param) {
	calls.push(["openAlert", param])
}

function close(param) {
	calls.unshift(["closeAlert", param])
}

function closeAlert() {
	if (alerts.length === 0) return
	const firstAlert = $(".alert").first()
	const firstAlertHeight = firstAlert.outerHeight(true)
	alerts.splice(0, 1)

	firstAlert.addClass("animate__fadeOutDown")

	for (const id of alerts) {
		const currentAlert = $(`#${id}`)
		currentAlert.css({
			top: currentAlert.position().top + firstAlertHeight,
			transition: "top 1s ease-in"
		})
	}
	topStackAlert += firstAlertHeight

	setTimeout(() => {
		firstAlert.alert("close")
	}, 1000)
}

function openAlert(type) {
	const html = window[type](loop)
	$(html).insertBefore(".footer")
	const alert = $(`#${loop}`)

	setTimeout(function () {
		const newTopStackAlert = topStackAlert - alert.outerHeight(true)
		// if (newTopStackAlert < 10) {
		// 	alert.alert("close")
		// 	open(type)
		// 	return
		// }

		alerts.push(loop)
		topStackAlert = newTopStackAlert
		alert.css({
			top: topStackAlert
		})
		alert.addClass("animate__fadeInDown")
	}, 1)
}

function bit(id) {
	return `
		<div id="${id}" class="alert alert-primary d-flex align-items-center animate__animated" role="alert">
			<img src="heart-solid.svg" height="30px" class="mr-4 animate__animated animate__heartBeat animate__infinite" />
			<div>
				<b>${faker.name.findName()}</b> : ${(Math.floor(Math.random() * Math.floor(49)) + 1) * 100} bits<br />
				<div class="message">
					${faker.lorem.paragraph()}
					${faker.lorem.paragraph()}
				</div>
			</div>
		</div>
	`
}

function sub(id) {
	return `
		<div id="${id}" class="alert alert-success d-flex align-items-center animate__animated" role="alert">
			<img src="fire-solid.svg" height="30px" class="mr-4 animate__animated animate__rubberBand animate__infinite" />
			<div>
				<b>${faker.name.findName()}</b> : sub
			</div>
		</div>
	`
}

function raid(id) {
	return `
		<div id="${id}" class="alert alert-danger d-flex align-items-center animate__animated" role="alert">
			<img src="bolt-solid.svg" height="30px" class="mr-4 animate__animated animate__shakeY animate__infinite" />
			<div>
				<b>${faker.name.findName()}</b> : raid
			</div>
		</div>
	`
}
