
window.testAll = ()=>{

	$(".testbtn").click();

}

window.doApiTest = (index,type,expectStatus)=>{

	const url = $(`#apiInput${index}`).val();

	const resultSpan = status => $(`#apiResult${index}`).text(  status == expectStatus ? 'SUCCESS':'FALSE' );
	const remarkSpan = t => $(`#apiRemark${index}`).text(t);


	$.ajax({
		type,
		url,
		cache:false,
		dataType:'json',
		error:(e)=>{

			const {status,responseJSON} = e;

			resultSpan(status);

			remarkSpan(`${status} => ${responseJSON.error}`)

		},
		success:data => {

			resultSpan(200);
			
		}

	})
}