
//@SpringBoot
class Application {

	//@Autowired
	springMvc;

	//@Autowired
	testApiService;


	async main(){

		await this.springMvc.start();

		await this.testApiService.testIndex();

		await this.testApiService.testResful();

		await this.testApiService.testMustTakeParam();

	}

}

//@Controller
//@Json
class IndexController {


	log;

	/**
		request url: http://localhost:3000?param1=aa
	*/
	//@Get(/)
	//@Param
	async index(request,response,param1){
		this.log.method("index").info({request:!!request,response:!!response,param1})
		return {msg:`welcome use spring-ioc-mvc,the query param1:${param1}`};
	}

}

//@Controller(test)
//@Json
class TestController {

	/**
		normal api: http://localhost:3000/test/say
	*/

	//@Get
	async say(request,response){
		return {msg:"Hello World"};
	}

	/**
		restful api: http://localhost:3000/test/name/world
	*/
	//@Get(/name/:content)
	//@Param(content=path)
	async name(content,param1){
		return `Hello => ${content},and param1:${param1}`;
	}

	//@Get
	//@Param(param1=query)
	async testParam(param1){
		return `param1:${param1}`;
	}
}

 module.exports = { Application,TestController,IndexController }