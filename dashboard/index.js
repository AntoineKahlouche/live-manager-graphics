let socket

$(async () => {
	socket = io()
	$("#onlyProInfo").prop("checked", (await axios.get("/onlyProInfo")).data)
	openAlertHandler()

	for (const data of Object.values((await axios.get("/historic")).data)) {
		open(data)
	}
})

function openAlertHandler() {
	socket.off()
	if ($("#message").prop("checked")) {
		socket.on("OPEN_ALERT", function (data) {
			if (data.type === "INFO") return
			open(data)
		})
	} else {
		socket.on("OPEN_ALERT", function (data) {
			if (data.type === "INFO" || data.type === "MSG") return
			open(data)
		})
	}
}
function open(data) {
	const functionName = _.toLower(data.type)
	$("body").append(window[functionName](data))
	bindCloseEvent(data.id)
}

function bindCloseEvent(id) {
	$("#" + id).on("closed.bs.alert", function () {
		const id = $(this).attr("id")
		if (!id) return
		socket.emit("CLOSE_ALERT", { id })
	})
}

function changeOnlyProInfo(checkbox) {
	axios.post("/onlyProInfo", { value: $(checkbox).prop("checked") })
}

function sendMessage() {
	const textarea = $("textarea")
	if (textarea.val()) {
		socket.emit("SEND_MESSAGE", { message: textarea.val() })
		textarea.val("")
	}
	return false
}

function msg(data) {
	return `
		<div id="${data.id}" class="alert border alert-dismissible d-flex align-items-center pointer" role="alert" class="close" data-dismiss="alert">
			<i class="fas fa-2x fa-comment mr-4"></i>
			<div>
				${data.title}<br />
				${data.message}
			</div>
		</div>
	`
}

function bit(data) {
	return `
		<div id="${data.id}" class="alert alert-primary alert-dismissible d-flex align-items-center pointer" role="alert" class="close" data-dismiss="alert">
			<i class="fas fa-2x fa-heart mr-4"></i>
			<div>
				${data.title}
				${data.message ? "<br />" + data.message : ""}
			</div>
		</div>
	`
}

function sub(data) {
	return `
		<div id="${data.id}" class="alert alert-success alert-dismissible d-flex align-items-center pointer" role="alert" class="close" data-dismiss="alert">
			<i class="fas fa-2x fa-fire mr-4"></i>
			<div>
				${data.title}
				${data.message ? "<br />" + data.message : ""}
			</div>
		</div>
	`
}

function raid(data) {
	return `
		<div id="${data.id}" class="alert alert-danger alert-dismissible d-flex align-items-center pointer" role="alert" class="close" data-dismiss="alert">
			<i class="fas fa-2x fa-bolt mr-4"></i>
			<div>
				${data.title}
			</div>
		</div>
	`
}
