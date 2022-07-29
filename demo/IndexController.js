
/**
	首页
*/

//@Controller(/)
class IndexController {

	log;


	/**
		路由：/
		参数：req,res,session,$session 均可以自动注入 
			 $session 代表的是包裹的session，提供的额外的api
	*/

	//@Get(/)
	async index(req,res,session,$session){

		const $sessionList = $session.getOr('$sessionList',[])

		return ['index',{msg:'hello world!',$sessionList}]
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

module.exports = { IndexController,SpringIocMvcExceptionHander}