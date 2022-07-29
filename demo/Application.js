
//@SpringBoot
class Application {

	//@Autowired
	springIocMvc;


	async main(){

		//启动springmvc
		await this.springIocMvc.start();

	}

}



/**
	扩展express
*/

//@SpringMvcAppExtend
class SpringMvcAppExtendBean1 {

	log;

	async loadApp(app){
		 this.log.method('loadApp').debug("可以使用@SpringMvcAppExtend扩展express,可以存在多个！");
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

 module.exports = { SpringMvcAppExtendBean1,Application,SpringIocMvcExceptionHander}