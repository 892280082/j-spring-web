const request = require("request")



//@Bean
class TestApiService {

	log;


	/**
		const sendData = {
		    url,
		    method: "POST",
		    headers: {
		        "content-type": "application/json",
		    }
		};
	*/
	doRequest(sendData){

		const log = this.log.method("_doRequset")

		log.debug("请求数据",sendData)

		return new Promise( (resolve,reject) => {
			request(sendData, function(error, response, body) {

				log.debug("返回数据",{error,body})

			    if (!error && response && response.statusCode == 200) {
			    	const data = JSON.parse(body)
					resolve(data)
			    }else{
			    	reject(`HOST REQUEST ERROR:${error}`)
			    }
			}); 
		})

	}

	//测试首页
	async testIndex(){

		const log = this.log.method("testIndex");

		const url = "http://localhost:3000?param1=aa";

		log.info("请求url:",url);

		const data = await this.doRequest({url,method:"GET"})

	}


	//测试resful请求
	async testResful(){

		const log = this.log.method("testResful");

		const url = "http://localhost:3000/test/name/world?param1=nice";

		log.info("请求url:",url);

		const data = await this.doRequest({url,method:"GET"})

	}


	//测试不携带参数的情况 测试结果 返回状态码 400  目前测试失败！
	async testMustTakeParam(){

		const log = this.log.method("testMustTakeParam");

		const url = "http://localhost:3000/test/testParam";

		log.info("请求url:",url);

		const data = await this.doRequest({url,method:"GET"})

	}

}

module.exports = {TestApiService}