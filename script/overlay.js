$(() => {
	animateFooter(0)

	const socket = io()
	socket.on("openAlert", function (data) {
		open(data)
	})
	socket.on("closeAlert", function (data) {
		close(data)
	})
})

function animateFooter(loop) {
	setTimeout(function () {
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

		animateFooter(loop + 1)
	}, 1000)
}

function open(data) {
	const lastAlert = $(".alert").last()
	const top = lastAlert.length === 0 ? 1040 : lastAlert.position().top

	const html = window[data.type](data)
	$(html).insertBefore(".footer")
	const alert = $(`#${data.id}`)
	alert.css({
		top: top - alert.outerHeight(true)
	})
	alert.addClass("animate__fadeInLeft")
}

function close(data) {
	const alert = $(`#${data.id}`)
	const alertHeight = alert.outerHeight(true)
	alert.addClass("animate__fadeOutLeft")

	$(".alert").map(function () {
		if ($(this).attr("id") <= data.id) return
		$(this).css({
			top: $(this).position().top + alertHeight,
			transition: "top 1s ease-in"
		})
	})

	setTimeout(() => {
		alert.alert("close")
	}, 1000)
}

function bit(data) {
	return `
		<div id="${data.id}" class="alert alert-primary d-flex align-items-center animate__animated" role="alert">
			<img src="heart-solid.svg" height="30px" class="mr-4 animate__animated animate__heartBeat animate__infinite" />
			<div>
				${data.title}
				${data.message ? "<br />" + data.message : ""}
			</div>
		</div>
	`
}

function sub(data) {
	return `
		<div id="${data.id}" class="alert alert-success d-flex align-items-center animate__animated" role="alert">
			<img src="fire-solid.svg" height="30px" class="mr-4 animate__animated animate__rubberBand animate__infinite" />
			<div>
				${data.title}
				${data.message ? "<br />" + data.message : ""}
			</div>
		</div>
	`
}

function raid(data) {
	return `
		<div id="${data.id}" class="alert alert-danger d-flex align-items-center animate__animated" role="alert">
			<img src="bolt-solid.svg" height="30px" class="mr-4 animate__animated animate__shakeY animate__infinite" />
			<div>
				${data.title}
			</div>
		</div>
	`
}
