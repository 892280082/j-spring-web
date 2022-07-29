
/**
	首页
*/

//@Controller(/)
class IndexController {

	log;

	//@Value(Spring-ioc-mvc.port)
	port;

	//@Autowired
	apiTestService;

	/**
		路由：/
		参数：req,res,session,$session 均可以自动注入 
			 $session 代表的是包裹的session，提供的额外的api
	*/

	//@Get(/)
	async index(req,res,session,$session){

		const $sessionList = $session.getOr('$sessionList',[])

		const requestPrefix = `http://localhost:${this.port}`;

		const {apiTestData} = this.apiTestService;

		return ['index',{msg:'hello world!',$sessionList,requestPrefix,apiTestData}]
	}

}



module.exports = { IndexController}