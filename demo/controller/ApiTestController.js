
/**
	测试接口传参的api
**/

//@Controller(apiTest)
class ApiTestController {

	//@Autowired
	apiTestService;

	//@Get
	//@Json
	async queryParamTest(a,b){
		return this.apiTestService.doVerify(100,{a,b})
	}

	//@Get
	//@Json
	//@Null(b)
	async queryParamTest2(a,b){
		return this.apiTestService.doVerify(107,{a,b})
	}


	//@Get(/resfulParamTest/:a/:b)
	//@Json
	async resfulParamTest(a,b){
		return this.apiTestService.doVerify(110,{a,b})
	}

	//@Get(/sendParam/:a)
	//@Json
	async sendParam(a,b){
		return this.apiTestService.doVerify(110,{a,b})
	}

	//@Get
	//@Json
	//@Aggregation(stu)
	async aggregation(stu){
		return this.apiTestService.doVerify(120,stu)
	}

}

module.exports = {ApiTestController}