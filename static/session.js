
window.cleanSessioon = ()=>{
	$.post(`/sessionApi/cleanSessioon`).then(data => {
		console.log(data)
	})
}

window.addSessioon = ()=>{


	const value = $("input[name='addInfoInput']").val();

	console.log(value)

	if(value){
		$.post(`/sessionApi/addSessionInfo?value=${value}`).then(data => {
			console.log(data)
		})
	}

}

window.removeSession = (index)=>{
	$.post(`/sessionApi/removeSession?index=${index}`).then(data => {
		console.log(data)
	})
}