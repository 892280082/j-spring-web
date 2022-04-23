
//@SpringBoot
class Application {

	//@Autowired
	springMvc;

	async main(){

		this.springMvc.start();

	}

}


//@Controller(test)
//@Json
class TestController {



	//@Get
	async say(request,response){
		return {msg:"Hello World"};
	}


	//@Get(/name/:content)
	//@Param(content=path)
	async name(content){
		return `word => ${content}`;
	}

}

 module.exports = { Application,TestController }