
const SESSION_LIST = '$sessionList';

/**

	session 的api操作

*/


//@Controller
class SessionApi {


	/**
		路由: /sessionApi/addSessionInfo?value=?
		$sessionList 带有$开头的参数会尝试从session中获取,不存在则报错.
	*/

	//@Post
	//@Json
	async addSessionInfo(value,$sessionList){
		$sessionList.push(value)
		return "SUCCESS";
	}

	/**
		销毁session "$sessionList"
	*/

	//@Post
	//@Json
	async cleanSessioon($session){
		$session.destory(SESSION_LIST)
		return "SUCCESS"
	}

	/**
		删除指定下标
	*/

	//@Post
	//@Json
	async removeSession($sessionList,index){
		$sessionList.splice(index,1);
		return "SUCCESS"
	}


}

module.exports = {SessionApi}