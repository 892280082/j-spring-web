
/**
	首页
*/

//@Controller(/)
class IndexController {

	log;


	/**
		路由：/
		参数：req,res,session 均可以自动注入
	*/

	//@Get(/)
	async index(req,res,session){

		const {$sessionList=[]} = session;


		//const $sessionList = $session.$getOr('$sessionList',[])

		//注册sessino
		session['$sessionList'] = $sessionList;

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