
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

 module.exports = { SpringMvcAppExtendBean1,Application,}