
//@SpringBoot
class Application {

	//@Autowired
	springIocMvc;

	//@Autowired
	testApiService;


	async main(){

		await this.springIocMvc.start();

		// await this.testApiService.testIndex();

		// await this.testApiService.testResful();

		// await this.testApiService.testMustTakeParam();

		// await this.testApiService.testParamNoForce();

		// await this.testApiService.testExceptionHander();

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

	//@Get
	async testParamNoForce(param1){
		return `testParamNoForce param1:${param1}`;
	}

	//@Get
	async testException(){
		return a+b;
	}

}


//@Controller(page)
class PageController {

	//@Get
	async index(request,response){
		return ['index',{msg:'hello'}];
	}

}


/**
	全局异常捕获
*/
//@Bean(springIocMvcExceptionHander)
class SpringIocMvcExceptionHander {

	log;

	html(error,req,res){
		this.log.method("html").error(error);
		res.status(500).json({error:error.message || e});
	}

	json(error,req,res){
		this.log.method("json").error(error);
		res.status(500).json({error:error.message || e});
	}

}

 module.exports = { Application,TestController,IndexController,PageController,SpringIocMvcExceptionHander}